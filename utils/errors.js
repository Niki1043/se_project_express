// add error status codes
// invalid data passed to methods
const INVALID_DATA_ERROR = 400;

const ID_NOT_FOUND = 404;

const DEFAULT_ERROR = 500;

const NO_DOCUMENTS_FOUND = new Error("No documents found");
NO_DOCUMENTS_FOUND.statusCode = DEFAULT_ERROR;
NO_DOCUMENTS_FOUND.name = "NotFoundError";

const NO_DATA_FOR_ID = new Error("Data for this id was not found");
NO_DATA_FOR_ID.statusCode = ID_NOT_FOUND;

module.exports = {
  INVALID_DATA_ERROR,
  ID_NOT_FOUND,
  DEFAULT_ERROR,
  NO_DOCUMENTS_FOUND,
  NO_DATA_FOR_ID,
};
