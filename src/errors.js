class CustomError extends Error {
  constructor(clientMessage, serverMessage = "") {
    super(clientMessage);
    this.serverMessage =
      serverMessage.length > 0 ? serverMessage : clientMessage;
  }
}

module.exports = {
  CustomError,
};
