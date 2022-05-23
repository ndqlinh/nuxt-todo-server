exports.checkHealth = async (req, res) => {
  res.status(200).send({ code: 200, message: 'Api health is good!' });
}
