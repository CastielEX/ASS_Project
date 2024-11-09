import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({
  totalPosts,
  productPerPage,
  setCurrentPage,
  currentPage,
}: any) => {
  let pages = [];

  // for( let i = 1; i <= Math.ceil(totalPosts/productPerPage); i++) {
  //     pages.push(i)
  // }

  const pageCount = Math.ceil(totalPosts / productPerPage);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div>
      {
        <ReactPaginate
          pageCount={pageCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageChange}
          forcePage={currentPage - 1}
          containerClassName="pagination"
          activeClassName="active"
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageClassName={"paginationButton"}
          previousClassName={"paginationButton"}
          nextClassName={"paginationButton"}
          pageLinkClassName={"page-link"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          disabledClassName={"disabled"}
        />
      }
    </div>
  );
};

export default Pagination;
