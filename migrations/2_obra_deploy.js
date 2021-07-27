const Obra = artifacts.require("Obra");

module.exports = function(deployer) {
  deployer.deploy(Obra);
};
