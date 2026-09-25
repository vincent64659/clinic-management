//  MOCK the db module BEFORE importing service
jest.mock("../../../src/config/database.js", () => ({
  query: jest.fn(),
}));

const mockDb = require("../../../src/config/database.js");

const medicalItemsService = require("../../../src/services/medical_items-service.js");

const {
  CREATE_MEDICAL_ITEM,
  FIND_ALL_MEDICAL_ITEMS,
  FIND_MEDICAL_ITEM_BY_ID,
  FIND_MEDICAL_ITEM_BY_NAME,
  UPDATE_MEDICAL_ITEM,
  DELETE_MEDICAL_ITEM,
} = require("../../../src/database/queries/medical_items-query.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createMedicalItem", () => {
  it("should create a medical item successfully", async () => {
    const mockResult = {
      insertId: 1,
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await medicalItemsService.createMedicalItem(
      "Paracetamol",
      "Medicine",
      "Tablet",
      100,
      20,
      "2027-12-31",
      "Available",
    );

    expect(mockDb.query).toHaveBeenCalledWith(CREATE_MEDICAL_ITEM, [
      "Paracetamol",
      "Medicine",
      "Tablet",
      100,
      20,
      "2027-12-31",
      "Available",
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when item name is missing", async () => {
    await expect(
      medicalItemsService.createMedicalItem(null, "Medicine", "Tablet", 100, 20, "2027-12-31", "Available"),
    ).rejects.toThrow("Item name, category, and unit are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when category is missing", async () => {
    await expect(
      medicalItemsService.createMedicalItem("Paracetamol", null, "Tablet", 100, 20, "2027-12-31", "Available"),
    ).rejects.toThrow("Item name, category, and unit are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when unit is missing", async () => {
    await expect(
      medicalItemsService.createMedicalItem("Paracetamol", "Medicine", null, 100, 20, "2027-12-31", "Available"),
    ).rejects.toThrow("Item name, category, and unit are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findAllMedicalItems", () => {
  it("should return all medical items", async () => {
    const mockRows = [
      {
        medical_item_id: 1,
        item_name: "Paracetamol",
        category: "Medicine",
        unit: "Tablet",
        quantity: 100,
        reorder_level: 20,
        expiration_date: "2027-12-31",
        status: "Available",
      },
      {
        medical_item_id: 2,
        item_name: "Bandage",
        category: "Supplies",
        unit: "Piece",
        quantity: 50,
        reorder_level: 10,
        expiration_date: "2028-06-30",
        status: "Available",
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await medicalItemsService.findAllMedicalItems();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_MEDICAL_ITEMS);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no medical items exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await medicalItemsService.findAllMedicalItems();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_MEDICAL_ITEMS);

    expect(result).toEqual([]);
  });
});

describe("findMedicalItemById", () => {
  it("should return a medical item by ID", async () => {
    const mockMedicalItem = {
      medical_item_id: 1,
      item_name: "Paracetamol",
      category: "Medicine",
      unit: "Tablet",
      quantity: 100,
      reorder_level: 20,
      expiration_date: "2027-12-31",
      status: "Available",
    };

    mockDb.query.mockResolvedValueOnce([[mockMedicalItem]]);

    const result = await medicalItemsService.findMedicalItemById(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_ITEM_BY_ID, [1]);

    expect(result).toEqual(mockMedicalItem);
  });

  it("should return null when the medical item does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await medicalItemsService.findMedicalItemById(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_ITEM_BY_ID, [999]);

    expect(result).toBeNull();
  });

  it("should throw an error when ID is missing", async () => {
    await expect(medicalItemsService.findMedicalItemById()).rejects.toThrow("Medical item ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findMedicalItemByName", () => {
  it("should return a medical item by name", async () => {
    const mockMedicalItem = {
      medical_item_id: 1,
      item_name: "Paracetamol",
      category: "Medicine",
      unit: "Tablet",
      quantity: 100,
      reorder_level: 20,
      expiration_date: "2027-12-31",
      status: "Available",
    };

    mockDb.query.mockResolvedValueOnce([[mockMedicalItem]]);

    const result = await medicalItemsService.findMedicalItemByName("Paracetamol");

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_ITEM_BY_NAME, ["Paracetamol"]);

    expect(result).toEqual(mockMedicalItem);
  });

  it("should return null when the medical item does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await medicalItemsService.findMedicalItemByName("Unknown Item");

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_ITEM_BY_NAME, ["Unknown Item"]);

    expect(result).toBeNull();
  });

  it("should throw an error when item name is missing", async () => {
    await expect(medicalItemsService.findMedicalItemByName()).rejects.toThrow("Item name is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("updateMedicalItem", () => {
  it("should update a medical item successfully", async () => {
    const mockResult = {
      affectedRows: 1,
      changedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await medicalItemsService.updateMedicalItem(
      1,
      "Paracetamol",
      "Medicine",
      "Tablet",
      150,
      25,
      "2027-12-31",
      "Available",
    );

    expect(mockDb.query).toHaveBeenCalledWith(UPDATE_MEDICAL_ITEM, [
      "Paracetamol",
      "Medicine",
      "Tablet",
      150,
      25,
      "2027-12-31",
      "Available",
      1,
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(
      medicalItemsService.updateMedicalItem(
        null,
        "Paracetamol",
        "Medicine",
        "Tablet",
        150,
        25,
        "2027-12-31",
        "Available",
      ),
    ).rejects.toThrow("Medical item ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when item name is missing", async () => {
    await expect(
      medicalItemsService.updateMedicalItem(1, null, "Medicine", "Tablet", 150, 25, "2027-12-31", "Available"),
    ).rejects.toThrow("Item name, category, and unit are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when category is missing", async () => {
    await expect(
      medicalItemsService.updateMedicalItem(1, "Paracetamol", null, "Tablet", 150, 25, "2027-12-31", "Available"),
    ).rejects.toThrow("Item name, category, and unit are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when unit is missing", async () => {
    await expect(
      medicalItemsService.updateMedicalItem(1, "Paracetamol", "Medicine", null, 150, 25, "2027-12-31", "Available"),
    ).rejects.toThrow("Item name, category, and unit are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("deleteMedicalItem", () => {
  it("should delete a medical item successfully", async () => {
    const mockResult = {
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await medicalItemsService.deleteMedicalItem(1);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_MEDICAL_ITEM, [1]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(medicalItemsService.deleteMedicalItem()).rejects.toThrow("Medical item ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should return the database result when no medical item was deleted", async () => {
    const mockResult = {
      affectedRows: 0,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await medicalItemsService.deleteMedicalItem(999);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_MEDICAL_ITEM, [999]);

    expect(result).toEqual(mockResult);
  });
});
