//  MOCK the db module BEFORE importing service
jest.mock("../../../src/config/database.js", () => ({
  query: jest.fn(),
}));

const mockDb = require("../../../src/config/database.js");

const healthFacilitiesService = require("../../../src/services/health_facilities-service.js");

const {
  CREATE_HEALTH_FACILITY,
  FIND_ALL_HEALTH_FACILITIES,
  FIND_HEALTH_FACILITY_BY_ID,
  FIND_HEALTH_FACILITY_BY_NAME,
  UPDATE_HEALTH_FACILITY,
  DELETE_HEALTH_FACILITY,
} = require("../../../src/database/queries/health_facilities-query.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createHealthFacility", () => {
  it("should create a health facility successfully", async () => {
    const mockResult = {
      insertId: 1,
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthFacilitiesService.createHealthFacility(
      "Cebu Medical Center",
      "Hospital",
      "Cebu City",
      "0321234567",
      "0327654321",
      "Juan Dela Cruz",
      "Active",
    );

    expect(mockDb.query).toHaveBeenCalledWith(CREATE_HEALTH_FACILITY, [
      "Cebu Medical Center",
      "Hospital",
      "Cebu City",
      "0321234567",
      "0327654321",
      "Juan Dela Cruz",
      "Active",
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when facility name is missing", async () => {
    await expect(
      healthFacilitiesService.createHealthFacility(
        null,
        "Hospital",
        "Cebu City",
        "0321234567",
        "0327654321",
        "Juan Dela Cruz",
        "Active",
      ),
    ).rejects.toThrow("Facility name and facility type are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when facility type is missing", async () => {
    await expect(
      healthFacilitiesService.createHealthFacility(
        "Cebu Medical Center",
        null,
        "Cebu City",
        "0321234567",
        "0327654321",
        "Juan Dela Cruz",
        "Active",
      ),
    ).rejects.toThrow("Facility name and facility type are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findAllHealthFacilities", () => {
  it("should return all health facilities", async () => {
    const mockRows = [
      {
        health_facility_id: 1,
        facility_name: "Cebu Medical Center",
        facility_type: "Hospital",
        address: "Cebu City",
        contact_number: "0321234567",
        emergency_number: "0327654321",
        contact_person: "Juan Dela Cruz",
        status: "Active",
      },
      {
        health_facility_id: 2,
        facility_name: "City Health Clinic",
        facility_type: "Clinic",
        address: "Cebu City",
        contact_number: "0321112222",
        emergency_number: "0323334444",
        contact_person: "Maria Santos",
        status: "Active",
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await healthFacilitiesService.findAllHealthFacilities();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_HEALTH_FACILITIES);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no health facilities exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await healthFacilitiesService.findAllHealthFacilities();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_HEALTH_FACILITIES);

    expect(result).toEqual([]);
  });
});

describe("findHealthFacilityById", () => {
  it("should return a health facility by ID", async () => {
    const mockHealthFacility = {
      health_facility_id: 1,
      facility_name: "Cebu Medical Center",
      facility_type: "Hospital",
      address: "Cebu City",
      contact_number: "0321234567",
      emergency_number: "0327654321",
      contact_person: "Juan Dela Cruz",
      status: "Active",
    };

    mockDb.query.mockResolvedValueOnce([[mockHealthFacility]]);

    const result = await healthFacilitiesService.findHealthFacilityById(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_FACILITY_BY_ID, [1]);

    expect(result).toEqual(mockHealthFacility);
  });

  it("should return null when the health facility does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await healthFacilitiesService.findHealthFacilityById(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_FACILITY_BY_ID, [999]);

    expect(result).toBeNull();
  });

  it("should throw an error when ID is missing", async () => {
    await expect(healthFacilitiesService.findHealthFacilityById()).rejects.toThrow("Health facility ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findHealthFacilityByName", () => {
  it("should return a health facility by name", async () => {
    const mockHealthFacility = {
      health_facility_id: 1,
      facility_name: "Cebu Medical Center",
      facility_type: "Hospital",
      address: "Cebu City",
      contact_number: "0321234567",
      emergency_number: "0327654321",
      contact_person: "Juan Dela Cruz",
      status: "Active",
    };

    mockDb.query.mockResolvedValueOnce([[mockHealthFacility]]);

    const result = await healthFacilitiesService.findHealthFacilityByName("Cebu Medical Center");

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_FACILITY_BY_NAME, ["Cebu Medical Center"]);

    expect(result).toEqual(mockHealthFacility);
  });

  it("should return null when the health facility does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await healthFacilitiesService.findHealthFacilityByName("Unknown Facility");

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_FACILITY_BY_NAME, ["Unknown Facility"]);

    expect(result).toBeNull();
  });

  it("should throw an error when facility name is missing", async () => {
    await expect(healthFacilitiesService.findHealthFacilityByName()).rejects.toThrow("Facility name is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("updateHealthFacility", () => {
  it("should update a health facility successfully", async () => {
    const mockResult = {
      affectedRows: 1,
      changedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthFacilitiesService.updateHealthFacility(
      1,
      "Cebu Medical Center",
      "Hospital",
      "Updated Cebu City Address",
      "0321234567",
      "0327654321",
      "Juan Dela Cruz",
      "Active",
    );

    expect(mockDb.query).toHaveBeenCalledWith(UPDATE_HEALTH_FACILITY, [
      "Cebu Medical Center",
      "Hospital",
      "Updated Cebu City Address",
      "0321234567",
      "0327654321",
      "Juan Dela Cruz",
      "Active",
      1,
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(
      healthFacilitiesService.updateHealthFacility(
        null,
        "Cebu Medical Center",
        "Hospital",
        "Cebu City",
        "0321234567",
        "0327654321",
        "Juan Dela Cruz",
        "Active",
      ),
    ).rejects.toThrow("Health facility ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when facility name is missing", async () => {
    await expect(
      healthFacilitiesService.updateHealthFacility(
        1,
        null,
        "Hospital",
        "Cebu City",
        "0321234567",
        "0327654321",
        "Juan Dela Cruz",
        "Active",
      ),
    ).rejects.toThrow("Facility name and facility type are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when facility type is missing", async () => {
    await expect(
      healthFacilitiesService.updateHealthFacility(
        1,
        "Cebu Medical Center",
        null,
        "Cebu City",
        "0321234567",
        "0327654321",
        "Juan Dela Cruz",
        "Active",
      ),
    ).rejects.toThrow("Facility name and facility type are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("deleteHealthFacility", () => {
  it("should delete a health facility successfully", async () => {
    const mockResult = {
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthFacilitiesService.deleteHealthFacility(1);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_HEALTH_FACILITY, [1]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(healthFacilitiesService.deleteHealthFacility()).rejects.toThrow("Health facility ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should return the database result when no health facility was deleted", async () => {
    const mockResult = {
      affectedRows: 0,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthFacilitiesService.deleteHealthFacility(999);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_HEALTH_FACILITY, [999]);

    expect(result).toEqual(mockResult);
  });
});
