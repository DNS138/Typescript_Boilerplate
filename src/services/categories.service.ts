import DB from '@databases';
import { CreateCategoryDto } from '@dtos/categories.dto';
import { HttpException } from '@exceptions/HttpException';
import { Category } from '@interfaces/categories.interface';
import { isEmpty } from '@utils/util';
import { config } from '@utils/config';

class CategoryService {
  public categories = DB.Categories;

  public async findAllCategory(): Promise<Category[]> {
    return this.categories.findAll();
  }

  public async findCategoryById(categoryId: number): Promise<Category> {
    if (isEmpty(categoryId)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not categoryId");
    }

    const findCategory: Category = await this.categories.findByPk(categoryId);
    if (!findCategory) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, "You're not category");
    }

    return findCategory;
  }

  public async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    if (isEmpty(categoryData)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not categoryData");
    }

    return this.categories.create({ ...categoryData });
  }

  public async updateCategory(categoryId: number, categoryData: CreateCategoryDto): Promise<Category> {
    if (isEmpty(categoryData)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not categoryData");
    }
    const findCategory: Category = await this.categories.findByPk(categoryId);
    if (!findCategory) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, "You're not user");
    }
    return this.categories.findByPk(categoryId);
  }

  public async deleteCategory(categoryId: number): Promise<Category> {
    if (isEmpty(categoryId)) {
      throw new HttpException(config.HTTP_BAD_REQUEST, "You're not categoryId");
    }

    const findCategory: Category = await this.categories.findByPk(categoryId);
    if (!findCategory) {
      throw new HttpException(config.HTTP_CONFLICTED_REQ, "You're not category");
    }

    await this.categories.destroy({ where: { id: categoryId } });

    return findCategory;
  }
}

export default CategoryService;
