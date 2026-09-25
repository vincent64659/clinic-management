//  MOCK the db module BEFORE importing service
jest.mock("../../../src/config/database.js", () => ({
  query: jest.fn(),
}));

const mockDb = require("../../../src/config/database.js");

const healthRecordsService = require("../../../src/services/health_records-service.js");

const {
  CREATE_HEALTH_RECORD,
  FIND_ALL_HEALTH_RECORDS,
  FIND_HEALTH_RECORD_BY_ID,
  FIND_HEALTH_RECORD_BY_STUDENT_ID,
  FIND_HEALTH_RECORD_BY_STAFF_ID,
  UPDATE_HEALTH_RECORD,
  DELETE_HEALTH_RECORD,
} = require("../../../src/database/queries/health_records-query.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createHealthRecord", () => {
  it("should create a health record for a student successfully", async () => {
    const mockResult = {
      insertId: 1,
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthRecordsService.createHealthRecord(
      1,
      null,
      "O+",
      "Peanuts",
      "Asthma",
      "Salbutamol",
      "Juan Dela Cruz",
      "09171234567",
      "Father",
      "No additional notes",
    );

    expect(mockDb.query).toHaveBeenCalledWith(CREATE_HEALTH_RECORD, [
      1,
      null,
      "O+",
      "Peanuts",
      "Asthma",
      "Salbutamol",
      "Juan Dela Cruz",
      "09171234567",
      "Father",
      "No additional notes",
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should create a health record for a staff member successfully", async () => {
    const mockResult = {
      insertId: 2,
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthRecordsService.createHealthRecord(
      null,
      5,
      "A+",
      "None",
      "Hypertension",
      "Amlodipine",
      "Maria Santos",
      "09181234567",
      "Spouse",
      "Regular medication",
    );

    expect(mockDb.query).toHaveBeenCalledWith(CREATE_HEALTH_RECORD, [
      null,
      5,
      "A+",
      "None",
      "Hypertension",
      "Amlodipine",
      "Maria Santos",
      "09181234567",
      "Spouse",
      "Regular medication",
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when both student ID and staff ID are missing", async () => {
    await expect(
      healthRecordsService.createHealthRecord(
        null,
        null,
        "O+",
        "None",
        "None",
        "None",
        "Juan Dela Cruz",
        "09171234567",
        "Father",
        "None",
      ),
    ).rejects.toThrow("Student ID or staff ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when both student ID and staff ID are provided", async () => {
    await expect(
      healthRecordsService.createHealthRecord(
        1,
        5,
        "O+",
        "None",
        "None",
        "None",
        "Juan Dela Cruz",
        "09171234567",
        "Father",
        "None",
      ),
    ).rejects.toThrow("Health record must belong to either a student or staff, not both.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findAllHealthRecords", () => {
  it("should return all health records", async () => {
    const mockRows = [
      {
        health_record_id: 1,
        student_id: 1,
        staff_id: null,
        blood_type: "O+",
        allergies: "Peanuts",
        medical_condition: "Asthma",
      },
      {
        health_record_id: 2,
        student_id: null,
        staff_id: 5,
        blood_type: "A+",
        allergies: "None",
        medical_condition: "Hypertension",
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await healthRecordsService.findAllHealthRecords();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_HEALTH_RECORDS);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no health records exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await healthRecordsService.findAllHealthRecords();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_HEALTH_RECORDS);

    expect(result).toEqual([]);
  });
});

describe("findHealthRecordById", () => {
  it("should return a health record by ID", async () => {
    const mockHealthRecord = {
      health_record_id: 1,
      student_id: 1,
      staff_id: null,
      blood_type: "O+",
      allergies: "Peanuts",
      medical_condition: "Asthma",
    };

    mockDb.query.mockResolvedValueOnce([[mockHealthRecord]]);

    const result = await healthRecordsService.findHealthRecordById(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_RECORD_BY_ID, [1]);

    expect(result).toEqual(mockHealthRecord);
  });

  it("should return null when the health record does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await healthRecordsService.findHealthRecordById(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_RECORD_BY_ID, [999]);

    expect(result).toBeNull();
  });

  it("should throw an error when ID is missing", async () => {
    await expect(healthRecordsService.findHealthRecordById()).rejects.toThrow("Health record ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findHealthRecordByStudentId", () => {
  it("should return a health record by student ID", async () => {
    const mockHealthRecord = {
      health_record_id: 1,
      student_id: 1,
      staff_id: null,
      blood_type: "O+",
      allergies: "Peanuts",
      medical_condition: "Asthma",
    };

    mockDb.query.mockResolvedValueOnce([[mockHealthRecord]]);

    const result = await healthRecordsService.findHealthRecordByStudentId(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_RECORD_BY_STUDENT_ID, [1]);

    expect(result).toEqual(mockHealthRecord);
  });

  it("should return null when the health record does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await healthRecordsService.findHealthRecordByStudentId(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_RECORD_BY_STUDENT_ID, [999]);

    expect(result).toBeNull();
  });

  it("should throw an error when student ID is missing", async () => {
    await expect(healthRecordsService.findHealthRecordByStudentId()).rejects.toThrow("Student ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findHealthRecordByStaffId", () => {
  it("should return a health record by staff ID", async () => {
    const mockHealthRecord = {
      health_record_id: 2,
      student_id: null,
      staff_id: 5,
      blood_type: "A+",
      allergies: "None",
      medical_condition: "Hypertension",
    };

    mockDb.query.mockResolvedValueOnce([[mockHealthRecord]]);

    const result = await healthRecordsService.findHealthRecordByStaffId(5);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_RECORD_BY_STAFF_ID, [5]);

    expect(result).toEqual(mockHealthRecord);
  });

  it("should return null when the health record does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await healthRecordsService.findHealthRecordByStaffId(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_HEALTH_RECORD_BY_STAFF_ID, [999]);

    expect(result).toBeNull();
  });

  it("should throw an error when staff ID is missing", async () => {
    await expect(healthRecordsService.findHealthRecordByStaffId()).rejects.toThrow("Staff ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("updateHealthRecord", () => {
  it("should update a student health record successfully", async () => {
    const mockResult = {
      affectedRows: 1,
      changedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthRecordsService.updateHealthRecord(
      1,
      1,
      null,
      "O+",
      "None",
      "Asthma",
      "Salbutamol",
      "Juan Dela Cruz",
      "09171234567",
      "Father",
      "Updated notes",
    );

    expect(mockDb.query).toHaveBeenCalledWith(UPDATE_HEALTH_RECORD, [
      1,
      null,
      "O+",
      "None",
      "Asthma",
      "Salbutamol",
      "Juan Dela Cruz",
      "09171234567",
      "Father",
      "Updated notes",
      1,
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should update a staff health record successfully", async () => {
    const mockResult = {
      affectedRows: 1,
      changedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthRecordsService.updateHealthRecord(
      2,
      null,
      5,
      "A+",
      "None",
      "Hypertension",
      "Amlodipine",
      "Maria Santos",
      "09181234567",
      "Spouse",
      "Updated notes",
    );

    expect(mockDb.query).toHaveBeenCalledWith(UPDATE_HEALTH_RECORD, [
      null,
      5,
      "A+",
      "None",
      "Hypertension",
      "Amlodipine",
      "Maria Santos",
      "09181234567",
      "Spouse",
      "Updated notes",
      2,
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(
      healthRecordsService.updateHealthRecord(
        null,
        1,
        null,
        "O+",
        "None",
        "Asthma",
        "Salbutamol",
        "Juan Dela Cruz",
        "09171234567",
        "Father",
        "None",
      ),
    ).rejects.toThrow("Health record ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when both student ID and staff ID are missing", async () => {
    await expect(
      healthRecordsService.updateHealthRecord(
        1,
        null,
        null,
        "O+",
        "None",
        "Asthma",
        "Salbutamol",
        "Juan Dela Cruz",
        "09171234567",
        "Father",
        "None",
      ),
    ).rejects.toThrow("Student ID or staff ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when both student ID and staff ID are provided", async () => {
    await expect(
      healthRecordsService.updateHealthRecord(
        1,
        1,
        5,
        "O+",
        "None",
        "Asthma",
        "Salbutamol",
        "Juan Dela Cruz",
        "09171234567",
        "Father",
        "None",
      ),
    ).rejects.toThrow("Health record must belong to either a student or staff, not both.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("deleteHealthRecord", () => {
  it("should delete a health record successfully", async () => {
    const mockResult = {
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthRecordsService.deleteHealthRecord(1);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_HEALTH_RECORD, [1]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(healthRecordsService.deleteHealthRecord()).rejects.toThrow("Health record ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should return the database result when no health record was deleted", async () => {
    const mockResult = {
      affectedRows: 0,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await healthRecordsService.deleteHealthRecord(999);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_HEALTH_RECORD, [999]);

    expect(result).toEqual(mockResult);
  });
});
