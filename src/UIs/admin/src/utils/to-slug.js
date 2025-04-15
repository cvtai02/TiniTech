const toSlug = (str) =>
  str
    .normalize('NFD') // tách dấu
    .replace(/[\u0300-\u036f]/g, '') // xóa dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '');

const dataWithSlugs = data.map((cat) => ({
  ...cat,
  slug: toSlug(cat.name),
  subcategories: cat.subcategories.map((sub) => ({
    ...sub,
    slug: toSlug(sub.name),
  })),
}));
