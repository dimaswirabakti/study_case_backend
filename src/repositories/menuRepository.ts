import { prisma } from "../config/db";
import { CreateMenuInput } from "../schemas/menuSchema";
import { Prisma } from "@prisma/client";

export const createMenu = async (data: CreateMenuInput) => {
  return await prisma.menu.create({
    data: {
      name: data.name,
      category: data.category,
      calories: data.calories,
      price: data.price,
      // Ingredients di Prisma tipe nya Json, tapi input kita array string.
      // Prisma otomatis ngehandle array JS ke JSONB Postgres.
      ingredients: data.ingredients,
      description: data.description,
    },
  });
};

export const findMenuById = async (id: number) => {
  return await prisma.menu.findUnique({
    where: { id },
  });
};

export const updateMenu = async (id: number, data: CreateMenuInput) => {
  return await prisma.menu.update({
    where: { id },
    data: {
      name: data.name,
      category: data.category,
      calories: data.calories,
      price: data.price,
      ingredients: data.ingredients,
      description: data.description,
    },
  });
};

export const deleteMenu = async (id: number) => {
  return await prisma.menu.delete({
    where: { id },
  });
};

interface MenuFilterOptions {
  q?: string | undefined;
  category?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  maxCal?: number | undefined;
  sortField?: string | undefined;
  sortOrder?: "asc" | "desc" | undefined;
  page: number;
  perPage: number;
}

export const findAllMenus = async (opts: MenuFilterOptions) => {
  // Bangun query "WHERE" secara dinamis
  const whereClause: Prisma.MenuWhereInput = {};

  if (opts.category) {
    whereClause.category = opts.category;
  }
  if (opts.minPrice !== undefined) {
    whereClause.price = {
      ...(whereClause.price as object),
      gte: opts.minPrice,
    };
  }
  if (opts.maxPrice !== undefined) {
    whereClause.price = {
      ...(whereClause.price as object),
      lte: opts.maxPrice,
    };
  }
  if (opts.maxCal !== undefined) {
    whereClause.calories = { lte: opts.maxCal };
  }
  if (opts.q) {
    whereClause.OR = [
      { name: { contains: opts.q, mode: "insensitive" } },
      { description: { contains: opts.q, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.MenuOrderByWithRelationInput = { created_at: "desc" };

  if (opts.sortField && opts.sortOrder) {
    orderBy = {
      [opts.sortField]: opts.sortOrder,
    } as Prisma.MenuOrderByWithRelationInput;
  }

  // total untuk pagination
  const total = await prisma.menu.count({ where: whereClause });

  const menus = await prisma.menu.findMany({
    where: whereClause,
    skip: (opts.page - 1) * opts.perPage,
    take: opts.perPage,
    orderBy: orderBy,
  });

  return { menus, total };
};

// Mode COUNT { "drinks": 5, "food": 3 }
export const getCategoryCounts = async () => {
  const result = await prisma.menu.groupBy({
    by: ["category"],
    _count: {
      category: true, // Hitung jumlah item per kategori
    },
  });

  // Transformasi data dari format Prisma ke format Postman
  // Dari [{ category: 'drinks', _count: { category: 5 }}], jadi { 'drinks': 5 }
  const formattedResult: Record<string, number> = {};

  result.forEach((item) => {
    formattedResult[item.category] = item._count.category;
  });

  return formattedResult;
};

// Mode LIST { "drinks": [{...}, {...}], "food": [{...}] }
export const getMenusByCategoryList = async (limit: number) => {
  // Ambil daftar kategori unik yang ada di database
  const categories = await prisma.menu.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  const result: Record<string, any[]> = {};

  // Loop setiap kategori untuk ambil itemnya (dibatasi limit)
  // pakai Promise.all agar query berjalan paralel
  await Promise.all(
    categories.map(async (c) => {
      const items = await prisma.menu.findMany({
        where: { category: c.category },
        take: limit, // Batasi jumlah item per kategori
        orderBy: { price: "asc" }, // urutkan harga termurah
      });
      result[c.category] = items;
    })
  );

  return result;
};
