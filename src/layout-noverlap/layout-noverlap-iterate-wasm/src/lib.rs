#![feature(box_syntax, wasm_simd)]
#[cfg(feature = "simd")]
use std::arch::wasm32::*;

use js_sys::Float32Array;
use rand::prelude::*;
use tinyset::Set;
use wasm_bindgen::prelude::*;

const NODE_X: usize = 0;
const NODE_Y: usize = 1;
const NODE_SIZE: usize = 2;

const PPN: u32 = 3;

fn jitter() -> f32 {
    let mut rng = rand::thread_rng();
    let y: f32 = rng.gen();
    return 0.01 * (0.5 - y);
}

#[wasm_bindgen]
pub fn get_memory() -> JsValue {
    wasm_bindgen::memory()
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

pub struct Context {
    pub matrix: Vec<f32>,
    pub converged: bool,
}

impl Context {
    pub fn new(matrix: Vec<f32>) -> Self {
        Context {
            matrix,
            converged: true,
        }
    }
}

#[wasm_bindgen]
pub fn create_computer_ctx(x: Vec<f32>) -> usize {
    let ctx = Context::new(x);
    Box::into_raw(box ctx) as _
}

#[wasm_bindgen]
pub fn get_node_matrix(ctx: *mut Context) -> Float32Array {
    let ctx = unsafe { &mut *ctx };
    unsafe { Float32Array::view(&ctx.matrix) }
}

#[wasm_bindgen]
pub fn get_converged(ctx: *mut Context) -> bool {
    let ctx = unsafe { &mut *ctx };
    ctx.converged
}

#[cfg(feature = "simd")]
#[wasm_bindgen]
pub fn iterate(
    margin: f32,
    ratio: f32,
    expansion: f32,
    grid_size: f32,
    speed: f32,
    ctx: *mut Context,
) {
    let ctx = unsafe { &mut *ctx };
    let mut node_matrix = &mut ctx.matrix;

    let mut str = "".to_string();

    let length: u32 = node_matrix.len() as u32;
    let order = ((length / PPN) | 0) as usize;

    let mut delta_x = vec![0.0 as f32; order];
    let mut delta_y = vec![0.0 as f32; order];

    let mut x_min = f32::INFINITY;
    let mut y_min = f32::INFINITY;
    let mut x_max = f32::NEG_INFINITY;
    let mut y_max = f32::NEG_INFINITY;

    {
        let mut i = 0;

        while i < length {
            let index = i as usize;
            let x = unsafe { *node_matrix.get_unchecked(index + NODE_X) };
            let y = unsafe { *node_matrix.get_unchecked(index + NODE_Y) };
            let size = unsafe { *node_matrix.get_unchecked(index + NODE_SIZE) * ratio + margin };

            x_min = f32::min(x_min, x - size);

            y_min = f32::min(y_min, y - size);

            x_max = f32::max(x_max, x + size);

            y_max = f32::max(y_max, x + size);

            i += PPN;
        }
    }

    let width = x_max - x_min;
    let height = y_max - y_min;
    let x_center = (x_max + x_min) / 2.0;
    let y_center = (y_max + y_min) / 2.0;

    x_min = (x_center as f64 - (expansion as f64 * width as f64) / 2.0) as f32;
    x_max = (x_center as f64 + (expansion as f64 * width as f64) / 2.0) as f32;
    y_min = (y_center as f64 - (expansion as f64 * height as f64) / 2.0) as f32;
    y_max = (y_center as f64 + (expansion as f64 * height as f64) / 2.0) as f32;

    let grid_length = (grid_size * grid_size) as usize;

    let mut grid = Vec::<Vec<u32>>::new();

    for n in 0..grid_length {
        grid.push(Vec::<u32>::new());
    }

    {
        let mut i = 0;
        while i < length {
            let index = i as usize;
            let x = unsafe { *node_matrix.get_unchecked(index + NODE_X) };
            let y = unsafe { *node_matrix.get_unchecked(index + NODE_Y) };
            let size = unsafe { *node_matrix.get_unchecked(index + NODE_SIZE) * ratio + margin };

            let nx_min = x - size;
            let nx_max = x + size;
            let ny_min = y - size;
            let ny_max = y + size;

            let n = f32x4(nx_min, nx_max, ny_min, ny_max);
            let size = f32x4(grid_size, grid_size, grid_size, grid_size);
            let f = f32x4(nx_min, nx_max, ny_min, ny_max);
            let min = f32x4(x_min, x_min, y_min, y_min);
            let max = f32x4(x_max, x_max, y_max, y_max);

            let n_s_i = f32x4_sub(n, min);
            let a_s_i = f32x4_sub(max, min);
            let s_m_n_s_i = f32x4_mul(size, n_s_i);
            let d = f32x4_div(s_m_n_s_i, a_s_i);

            let (x_min_box, x_max_box, y_min_box, y_max_box) = unsafe {
                (
                    f32x4_extract_lane::<0>(d),
                    f32x4_extract_lane::<1>(d),
                    f32x4_extract_lane::<2>(d),
                    f32x4_extract_lane::<3>(d),
                )
            };

            let x_min_box = f32::floor(x_min_box);
            let x_max_box = f32::floor(x_max_box);
            let y_min_box = f32::floor(y_min_box);
            let y_max_box = f32::floor(y_max_box);

            {
                let mut col = x_min_box;
                while col <= x_max_box {
                    let mut row = y_min_box;
                    while row <= y_max_box {
                        grid[(col * grid_size + row) as usize].push(i);
                        row += 1.0;
                    }
                    col += 1.0;
                }
            }

            i += PPN;
        }
    }

    {
        let mut collisions = Set::<(usize, usize)>::new();
        let mut c = 0;
        while c < grid_length {
            let cell = unsafe { grid.get_unchecked(c) };
            let cell_length = cell.len() as usize;

            let mut i = 0;

            while i < cell_length {
                let n1 = unsafe { *cell.get_unchecked(i) as usize };

                let x1 = unsafe { *node_matrix.get_unchecked(n1 + NODE_X) };
                let y1 = unsafe { *node_matrix.get_unchecked(n1 + NODE_Y) };
                let s1 = unsafe { *node_matrix.get_unchecked(n1 + NODE_SIZE) };

                let mut j = i + 1;
                while j < cell_length {
                    let n2 = unsafe { *cell.get_unchecked(j) as usize };
                    let h = (n1, n2);
                    if grid_length > 1 && collisions.contains(&h) {
                        j += 1;
                        continue;
                    }

                    if grid_length > 1 {
                        collisions.insert(h);
                    }

                    let x2 = unsafe { *node_matrix.get_unchecked(n2 + NODE_X) };
                    let y2 = unsafe { *node_matrix.get_unchecked(n2 + NODE_Y) };
                    let s2 = unsafe { *node_matrix.get_unchecked(n2 + NODE_SIZE) };

                    let x_dist = x2 - x1;
                    let y_dist = y2 - y1;
                    let dist = f32::sqrt(x_dist * x_dist + y_dist * y_dist);
                    let collision = dist < s1 * ratio + margin + (s2 * ratio + margin);
                    if collision {
                        ctx.converged = false;

                        let n2 = ((n2 as u32 / PPN) | 0) as usize;
                        if dist > 0.0 {
                            unsafe {
                                *delta_x.get_unchecked_mut(n2) += (x_dist / dist) * (1.0 + s1);
                                *delta_y.get_unchecked_mut(n2) += (y_dist / dist) * (1.0 + s1);
                            };
                        } else {
                            unsafe {
                                *delta_x.get_unchecked_mut(n2) += width * jitter();
                                *delta_y.get_unchecked_mut(n2) += height * jitter();
                            };
                        }
                    }

                    j += 1;
                }

                i += 1;
            }

            c += 1;
        }
    }

    {
        let mut i = 0;
        let mut j = 0;
        while i < length {
            let index = i as usize;
            unsafe {
                *node_matrix.get_unchecked_mut(index + NODE_X) +=
                    *delta_x.get_unchecked(j) * 0.1 * speed;
                *node_matrix.get_unchecked_mut(index + NODE_Y) +=
                    *delta_y.get_unchecked(j) * 0.1 * speed;
            }
            i += PPN;
            j += 1;
        }
    }
}
