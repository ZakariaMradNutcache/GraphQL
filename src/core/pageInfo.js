export class PageInfo {
    constructor({ totalCount, limit, page }) {
        this.totalPages = Math.ceil(totalCount / limit);
        this.currentPage = page;
        this.hasPreviousPage = this.currentPage > 1;
        this.hasNextPage = this.currentPage < this.totalPages;
        this.nextPage = this.hasNextPage ? this.currentPage + 1 : null;
        this.previousPage = this.hasPreviousPage ? this.currentPage - 1 : null;
    }
}
