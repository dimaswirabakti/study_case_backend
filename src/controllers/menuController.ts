import { Request, Response } from "express";
import { createMenuSchema } from "../schemas/menuSchema";
import * as menuService from "../services/menuService";
import * as aiService from '../services/aiService';

export const createMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validasi Input, safeParse mengembalikan objek success/error
    const validation = createMenuSchema.safeParse(req);

    if (!validation.success) {
      res.status(400).json({
        message: "Validation Error",
        errors: validation.error.format(),
      });
      return;
    }

    const newMenu = await menuService.addMenu(validation.data.body);

    res.status(201).json({
      message: "Menu created successfully",
      data: newMenu,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /menu/:id
export const getMenuById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    // Validasi sederhana, pastikan id adalah angka
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const menu = await menuService.getMenuById(id);

    if (!menu) {
      res.status(404).json({ message: `Menu (id: ${id}) not found` });
      return;
    }

    res.status(200).json({ data: menu });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// PUT /menu/:id
export const updateMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const validation = createMenuSchema.safeParse(req);
    if (!validation.success) {
      res.status(400).json({
        message: "Validation Error",
        errors: validation.error.format(),
      });
      return;
    }

    // Cek apakah menu ada?
    const existingMenu = await menuService.getMenuById(id);
    if (!existingMenu) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }

    const updatedMenu = await menuService.editMenu(id, validation.data.body);
    res
      .status(200)
      .json({ message: "Menu updated successfully", data: updatedMenu });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE /menu/:id
export const deleteMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    const existingMenu = await menuService.getMenuById(id);
    if (!existingMenu) {
      res.status(404).json({ message: "Menu not found" });
      return;
    }

    await menuService.removeMenu(id);
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /menu (List with Filter & Pagination)
export const getMenus = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ubah tipe data query params (string -> number) dan sertakan default value jika kosong
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.per_page) || 10;

    // Casting string
    const q = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const sort = req.query.sort as string | undefined;

    // Filter angka, hanya diubah jadi number jika ada nilainya
    const minPrice = req.query.min_price
      ? Number(req.query.min_price)
      : undefined;
    const maxPrice = req.query.max_price
      ? Number(req.query.max_price)
      : undefined;
    const maxCal = req.query.max_cal ? Number(req.query.max_cal) : undefined;

    const withAiSummary = req.query.with_ai_summary === 'true';

    const { menus, total } = await menuService.getAllMenus(
      page,
      perPage,
      q,
      category,
      minPrice,
      maxPrice,
      maxCal,
      sort
    );

    let aiInsights = undefined;
    if (withAiSummary) {
        aiInsights = await aiService.generateMenuInsights(menus);
    }

    const totalPages = Math.ceil(total / perPage);

    res.status(200).json({
      data: menus,
      pagination: {
        total,
        page,
        per_page: perPage,
        total_pages: totalPages,
      },
      // gunakan spread operator agar field 'ai_insights'
      // hanya muncul jika variabelnya tidak undefined.
      ...(aiInsights && { ai_insights: aiInsights }) 
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /menu/group-by-category
export const getMenusGrouped = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // default mode="list" dan per_category=5
    const mode = (req.query.mode as string) || "list";
    const perCategory = Number(req.query.per_category) || 5;

    const data = await menuService.getGroupedMenus(mode, perCategory);

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.error("Error grouping menus:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
