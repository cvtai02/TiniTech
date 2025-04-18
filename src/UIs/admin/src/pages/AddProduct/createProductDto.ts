export class CreateProductDto {
  name: string;
  categoryId: number; // Assuming categoryId is a number, change to string if needed
  description: string;
  image: File;

  constructor(
    name: string,
    categoryId: number,
    description: string,
    image: File,
  ) {
    this.name = name;
    this.categoryId = categoryId;
    this.description = description;
    this.image = image;
  }
}
