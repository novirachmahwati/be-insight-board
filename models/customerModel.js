const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({}, { strict: false });

const Customer = mongoose.model("Customer", customerSchema, "customer");

module.exports = Customer;
