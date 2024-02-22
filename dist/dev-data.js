"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const generateUsers = (num) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < num; i++) {
        const user = {
            name: faker_1.faker.person.fullName(),
            username: faker_1.faker.internet.userName(),
            password: "pass1234",
            role: faker_1.faker.helpers.arrayElement(["manager", "cashier"]),
        };
        yield prisma.user.create({ data: user });
    }
});
const generateOwner = () => __awaiter(void 0, void 0, void 0, function* () {
    const owner = {
        name: "Grey Boolean",
        username: "greyboolean",
        password: "pass1234",
        role: "owner",
    };
    yield prisma.user.create({ data: owner });
});
const generateMedicines = (num) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < num; i++) {
        const medicine = {
            name: faker_1.faker.commerce.productName(),
            description: faker_1.faker.lorem.sentence(),
            quantity: parseInt(faker_1.faker.string.numeric()),
        };
        yield prisma.medicine.create({ data: medicine });
    }
});
const generateCustomers = (num) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < num; i++) {
        const customer = {
            name: faker_1.faker.person.fullName(),
            email: faker_1.faker.internet.email(),
            address: faker_1.faker.location.streetAddress(),
            phoneNumber: faker_1.faker.phone.number(),
        };
        yield prisma.customer.create({ data: customer });
    }
});
const generateData = (num) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Generating data...");
    yield Promise.all([
        generateUsers(num),
        generateMedicines(num),
        generateCustomers(num),
    ]);
    yield generateOwner();
    console.log("Data generation completed.");
});
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Deleting data...");
    yield Promise.all([
        prisma.user.deleteMany(),
        prisma.medicine.deleteMany(),
        prisma.customer.deleteMany(),
    ]);
    console.log("Data deleted.");
});
const command = process.argv[2];
const num = parseInt(process.argv[3]) || 5;
if (command === "generate") {
    generateData(num);
}
else if (command === "delete") {
    deleteData();
}
else {
    console.log('Invalid command. Use "generate" or "delete".');
}
prisma.$disconnect();
