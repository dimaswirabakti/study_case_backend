import * as menuRepo from "../repositories/menuRepository";
import { CreateMenuInput } from "../schemas/menuSchema";

export const addMenu = async (data: CreateMenuInput) => {
  // Nanti, Cek jika description kosong -> Panggil AI
  // Kalo Sekarang Langsung simpan ke DB
  return await menuRepo.createMenu(data);
};

export const getMenuById = async (id: number) => {
  return await menuRepo.findMenuById(id);
};

export const editMenu = async (id: number, data: CreateMenuInput) => {
  // Disini nanti tempat logika cek apakah ID valid sebelum update
  return await menuRepo.updateMenu(id, data);
};

export const removeMenu = async (id: number) => {
  return await menuRepo.deleteMenu(id);
};

export const getAllMenus = async (
  page: number,
  perPage: number,
  q?: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  maxCal?: number,
  sortStr?: string
) => {
  // Logic parsing sort: "price:asc" menjadi -> field="price", order="asc"

  // secara default urutkan berdasarkan created_at descending (terbaru)
  let sortField = "created_at";
  let sortOrder: "asc" | "desc" = "desc";

  if (sortStr) {
    const [field, order] = sortStr.split(":");
    // Validasi agar tidak error jika format salah
    if (field) sortField = field;
    if (order === "asc" || order === "desc") sortOrder = order;
  }

  return await menuRepo.findAllMenus({
    page,
    perPage,
    q,
    category,
    minPrice,
    maxPrice,
    maxCal,
    sortField,
    sortOrder,
  });
};

export const getGroupedMenus = async (mode: string, perCategory: number) => {
  if (mode === "count") {
    return await menuRepo.getCategoryCounts();
  }

  if (mode === "list") {
    return await menuRepo.getMenusByCategoryList(perCategory);
  }

  // jika mode asal-asalan: return object kosong
  return {};
};
