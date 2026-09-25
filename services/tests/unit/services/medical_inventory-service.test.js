//  MOCK the db module BEFORE importing service
jest.mock("../../../src/config/database.js", () => ({
  query: jest.fn(),
}));

const mockDb = require("../../../src/config/database.js");

const medicalInventoryService = require("../../../src/services/medical_inventory-service.js");

const {
  CREATE_MEDICAL_INVENTORY,
  FIND_ALL_MEDICAL_INVENTORY,
  FIND_MEDICAL_INVENTORY_BY_ID,
  FIND_MEDICAL_INVENTORY_BY_ITEM_ID,
  FIND_MEDICAL_INVENTORY_BY_RECORDED_BY,
  UPDATE_MEDICAL_INVENTORY,
  DELETE_MEDICAL_INVENTORY,
} = require("../../../src/database/queries/medical_inventory-query.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createMedicalInventory", () => {
  it("should create a medical inventory transaction successfully", async () => {
    const mockResult = {
      insertId: 1,
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await medicalInventoryService.createMedicalInventory(
      1,
      "IN",
      50,
      "2026-09-25",
      "New stock received",
      5,
    );

    expect(mockDb.query).toHaveBeenCalledWith(CREATE_MEDICAL_INVENTORY, [
      1,
      "IN",
      50,
      "2026-09-25",
      "New stock received",
      5,
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when medical item ID is missing", async () => {
    await expect(
      medicalInventoryService.createMedicalInventory(null, "IN", 50, "2026-09-25", "New stock received", 5),
    ).rejects.toThrow("Medical item ID, transaction type, quantity, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when transaction type is missing", async () => {
    await expect(
      medicalInventoryService.createMedicalInventory(1, null, 50, "2026-09-25", "New stock received", 5),
    ).rejects.toThrow("Medical item ID, transaction type, quantity, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when quantity is missing", async () => {
    await expect(
      medicalInventoryService.createMedicalInventory(1, "IN", null, "2026-09-25", "New stock received", 5),
    ).rejects.toThrow("Medical item ID, transaction type, quantity, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when recorded by is missing", async () => {
    await expect(
      medicalInventoryService.createMedicalInventory(1, "IN", 50, "2026-09-25", "New stock received", null),
    ).rejects.toThrow("Medical item ID, transaction type, quantity, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findAllMedicalInventory", () => {
  it("should return all medical inventory transactions", async () => {
    const mockRows = [
      {
        medical_inventory_id: 1,
        medical_item_id: 1,
        transaction_type: "IN",
        quantity: 50,
        transaction_date: "2026-09-25",
        remarks: "New stock received",
        recorded_by: 5,
      },
      {
        medical_inventory_id: 2,
        medical_item_id: 2,
        transaction_type: "OUT",
        quantity: 10,
        transaction_date: "2026-09-25",
        remarks: "Issued to clinic",
        recorded_by: 5,
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await medicalInventoryService.findAllMedicalInventory();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_MEDICAL_INVENTORY);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no inventory transactions exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await medicalInventoryService.findAllMedicalInventory();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_MEDICAL_INVENTORY);

    expect(result).toEqual([]);
  });
});

describe("findMedicalInventoryById", () => {
  it("should return a medical inventory transaction by ID", async () => {
    const mockInventory = {
      medical_inventory_id: 1,
      medical_item_id: 1,
      transaction_type: "IN",
      quantity: 50,
      transaction_date: "2026-09-25",
      remarks: "New stock received",
      recorded_by: 5,
    };

    mockDb.query.mockResolvedValueOnce([[mockInventory]]);

    const result = await medicalInventoryService.findMedicalInventoryById(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_INVENTORY_BY_ID, [1]);

    expect(result).toEqual(mockInventory);
  });

  it("should return null when the medical inventory transaction does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await medicalInventoryService.findMedicalInventoryById(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_INVENTORY_BY_ID, [999]);

    expect(result).toBeNull();
  });

  it("should throw an error when ID is missing", async () => {
    await expect(medicalInventoryService.findMedicalInventoryById()).rejects.toThrow(
      "Medical inventory ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findMedicalInventoryByItemId", () => {
  it("should return medical inventory transactions by medical item ID", async () => {
    const mockRows = [
      {
        medical_inventory_id: 1,
        medical_item_id: 1,
        transaction_type: "IN",
        quantity: 50,
        transaction_date: "2026-09-25",
        remarks: "New stock received",
        recorded_by: 5,
      },
      {
        medical_inventory_id: 2,
        medical_item_id: 1,
        transaction_type: "OUT",
        quantity: 10,
        transaction_date: "2026-09-26",
        remarks: "Issued to clinic",
        recorded_by: 5,
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await medicalInventoryService.findMedicalInventoryByItemId(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_INVENTORY_BY_ITEM_ID, [1]);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no transactions exist for the medical item", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await medicalInventoryService.findMedicalInventoryByItemId(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_INVENTORY_BY_ITEM_ID, [999]);

    expect(result).toEqual([]);
  });

  it("should throw an error when medical item ID is missing", async () => {
    await expect(medicalInventoryService.findMedicalInventoryByItemId()).rejects.toThrow(
      "Medical item ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findMedicalInventoryByRecordedBy", () => {
  it("should return medical inventory transactions by staff ID", async () => {
    const mockRows = [
      {
        medical_inventory_id: 1,
        medical_item_id: 1,
        transaction_type: "IN",
        quantity: 50,
        transaction_date: "2026-09-25",
        remarks: "New stock received",
        recorded_by: 5,
      },
      {
        medical_inventory_id: 2,
        medical_item_id: 2,
        transaction_type: "OUT",
        quantity: 10,
        transaction_date: "2026-09-26",
        remarks: "Issued to clinic",
        recorded_by: 5,
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await medicalInventoryService.findMedicalInventoryByRecordedBy(5);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_INVENTORY_BY_RECORDED_BY, [5]);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no transactions were recorded by the staff member", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await medicalInventoryService.findMedicalInventoryByRecordedBy(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_MEDICAL_INVENTORY_BY_RECORDED_BY, [999]);

    expect(result).toEqual([]);
  });

  it("should throw an error when recorded by staff ID is missing", async () => {
    await expect(medicalInventoryService.findMedicalInventoryByRecordedBy()).rejects.toThrow(
      "Recorded by staff ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("updateMedicalInventory", () => {
  it("should update a medical inventory transaction successfully", async () => {
    const mockResult = {
      affectedRows: 1,
      changedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await medicalInventoryService.updateMedicalInventory(
      1,
      1,
      "OUT",
      10,
      "2026-09-26",
      "Issued to clinic",
      5,
    );

    expect(mockDb.query).toHaveBeenCalledWith(UPDATE_MEDICAL_INVENTORY, [
      1,
      "OUT",
      10,
      "2026-09-26",
      "Issued to clinic",
      5,
      1,
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(
      medicalInventoryService.updateMedicalInventory(null, 1, "OUT", 10, "2026-09-26", "Issued to clinic", 5),
    ).rejects.toThrow("Medical inventory ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when medical item ID is missing", async () => {
    await expect(
      medicalInventoryService.updateMedicalInventory(1, null, "OUT", 10, "2026-09-26", "Issued to clinic", 5),
    ).rejects.toThrow("Medical item ID, transaction type, quantity, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when transaction type is missing", async () => {
    await expect(
      medicalInventoryService.updateMedicalInventory(1, 1, null, 10, "2026-09-26", "Issued to clinic", 5),
    ).rejects.toThrow("Medical item ID, transaction type, quantity, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when quantity is missing", async () => {
    await expect(
      medicalInventoryService.updateMedicalInventory(1, 1, "OUT", null, "2026-09-26", "Issued to clinic", 5),
    ).rejects.toThrow("Medical item ID, transaction type, quantity, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when recorded by is missing", async () => {
    await expect(
      medicalInventoryService.updateMedicalInventory(1, 1, "OUT", 10, "2026-09-26", "Issued to clinic", null),
    ).rejects.toThrow("Medical item ID, transaction type, quantity, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("deleteMedicalInventory", () => {
  it("should delete a medical inventory transaction successfully", async () => {
    const mockResult = {
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await medicalInventoryService.deleteMedicalInventory(1);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_MEDICAL_INVENTORY, [1]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(medicalInventoryService.deleteMedicalInventory()).rejects.toThrow("Medical inventory ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should return the database result when no transaction was deleted", async () => {
    const mockResult = {
      affectedRows: 0,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await medicalInventoryService.deleteMedicalInventory(999);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_MEDICAL_INVENTORY, [999]);

    expect(result).toEqual(mockResult);
  });
});
