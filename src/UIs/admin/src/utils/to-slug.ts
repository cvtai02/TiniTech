export function toSlug(name: string): string {
  let slug = name.toLowerCase();

  const vietnameseChars = {
    à: 'a',
    á: 'a',
    ả: 'a',
    ã: 'a',
    ạ: 'a',
    ă: 'a',
    ằ: 'a',
    ắ: 'a',
    ẳ: 'a',
    ẵ: 'a',
    ặ: 'a',
    â: 'a',
    ầ: 'a',
    ấ: 'a',
    ẩ: 'a',
    ẫ: 'a',
    ậ: 'a',
    đ: 'd',
    è: 'e',
    é: 'e',
    ẻ: 'e',
    ẽ: 'e',
    ẹ: 'e',
    ê: 'e',
    ề: 'e',
    ế: 'e',
    ể: 'e',
    ễ: 'e',
    ệ: 'e',
    ì: 'i',
    í: 'i',
    ỉ: 'i',
    ĩ: 'i',
    ị: 'i',
    ò: 'o',
    ó: 'o',
    ỏ: 'o',
    õ: 'o',
    ọ: 'o',
    ô: 'o',
    ồ: 'o',
    ố: 'o',
    ổ: 'o',
    ỗ: 'o',
    ộ: 'o',
    ơ: 'o',
    ờ: 'o',
    ớ: 'o',
    ở: 'o',
    ỡ: 'o',
    ợ: 'o',
    ù: 'u',
    ú: 'u',
    ủ: 'u',
    ũ: 'u',
    ụ: 'u',
    ư: 'u',
    ừ: 'u',
    ứ: 'u',
    ử: 'u',
    ữ: 'u',
    ự: 'u',
    ỳ: 'y',
    ý: 'y',
    ỷ: 'y',
    ỹ: 'y',
    ỵ: 'y',
  };

  // Replace each Vietnamese character
  for (const [vietnameseChar, latinChar] of Object.entries(vietnameseChars)) {
    slug = slug.replace(new RegExp(vietnameseChar, 'g'), latinChar);
  }

  // Step 3: Replace spaces with hyphens and remove special characters
  slug = slug
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove non-word characters except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end

  return slug;
}
