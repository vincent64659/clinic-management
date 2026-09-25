//  MOCK the db module BEFORE importing service
jest.mock("../../../src/config/database.js", () => ({
  query: jest.fn(),
}));

const mockDb = require("../../../src/config/database.js");

const symptomsService = require("../../../src/services/symptoms-service.js");

const {
  CREATE_SYMPTOM,
  FIND_ALL_SYMPTOMS,
  FIND_SYMPTOM_BY_ID,
  FIND_SYMPTOM_BY_NAME,
  UPDATE_SYMPTOM,
  DELETE_SYMPTOM,
} = require("../../../src/database/queries/symptoms-query.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createSymptom", () => {
  it("should create a symptom successfully", async () => {
    const mockResult = {
      insertId: 1,
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await symptomsService.createSymptom("Headache", "Pain in the head", "Active");

    expect(mockDb.query).toHaveBeenCalledWith(CREATE_SYMPTOM, ["Headache", "Pain in the head", "Active"]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when symptom name is missing", async () => {
    await expect(symptomsService.createSymptom(null, "Pain in the head", "Active")).rejects.toThrow(
      "Symptom name is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findAllSymptoms", () => {
  it("should return all symptoms", async () => {
    const mockRows = [
      {
        symptom_id: 1,
        symptom_name: "Headache",
        description: "Pain in the head",
        status: "Active",
      },
      {
        symptom_id: 2,
        symptom_name: "Fever",
        description: "Elevated body temperature",
        status: "Active",
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await symptomsService.findAllSymptoms();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_SYMPTOMS);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no symptoms exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await symptomsService.findAllSymptoms();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_SYMPTOMS);

    expect(result).toEqual([]);
  });
});

describe("findSymptomById", () => {
  it("should return a symptom by ID", async () => {
    const mockSymptom = {
      symptom_id: 1,
      symptom_name: "Headache",
      description: "Pain in the head",
      status: "Active",
    };

    mockDb.query.mockResolvedValueOnce([[mockSymptom]]);

    const result = await symptomsService.findSymptomById(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_SYMPTOM_BY_ID, [1]);

    expect(result).toEqual(mockSymptom);
  });

  it("should return null when the symptom does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await symptomsService.findSymptomById(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_SYMPTOM_BY_ID, [999]);

    expect(result).toBeNull();
  });

  it("should throw an error when ID is missing", async () => {
    await expect(symptomsService.findSymptomById()).rejects.toThrow("Symptom ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findSymptomByName", () => {
  it("should return a symptom by name", async () => {
    const mockSymptom = {
      symptom_id: 1,
      symptom_name: "Headache",
      description: "Pain in the head",
      status: "Active",
    };

    mockDb.query.mockResolvedValueOnce([[mockSymptom]]);

    const result = await symptomsService.findSymptomByName("Headache");

    expect(mockDb.query).toHaveBeenCalledWith(FIND_SYMPTOM_BY_NAME, ["Headache"]);

    expect(result).toEqual(mockSymptom);
  });

  it("should return null when the symptom does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await symptomsService.findSymptomByName("Unknown Symptom");

    expect(mockDb.query).toHaveBeenCalledWith(FIND_SYMPTOM_BY_NAME, ["Unknown Symptom"]);

    expect(result).toBeNull();
  });

  it("should throw an error when symptom name is missing", async () => {
    await expect(symptomsService.findSymptomByName()).rejects.toThrow("Symptom name is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("updateSymptom", () => {
  it("should update a symptom successfully", async () => {
    const mockResult = {
      affectedRows: 1,
      changedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await symptomsService.updateSymptom(1, "Severe Headache", "Severe pain in the head", "Active");

    expect(mockDb.query).toHaveBeenCalledWith(UPDATE_SYMPTOM, [
      "Severe Headache",
      "Severe pain in the head",
      "Active",
      1,
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(symptomsService.updateSymptom(null, "Headache", "Pain in the head", "Active")).rejects.toThrow(
      "Symptom ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when symptom name is missing", async () => {
    await expect(symptomsService.updateSymptom(1, null, "Pain in the head", "Active")).rejects.toThrow(
      "Symptom name is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("deleteSymptom", () => {
  it("should delete a symptom successfully", async () => {
    const mockResult = {
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await symptomsService.deleteSymptom(1);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_SYMPTOM, [1]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(symptomsService.deleteSymptom()).rejects.toThrow("Symptom ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should return the database result when no symptom was deleted", async () => {
    const mockResult = {
      affectedRows: 0,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await symptomsService.deleteSymptom(999);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_SYMPTOM, [999]);

    expect(result).toEqual(mockResult);
  });
});
