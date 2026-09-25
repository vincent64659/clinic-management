//  MOCK the db module BEFORE importing service
jest.mock("../../../src/config/database.js", () => ({
  query: jest.fn(),
}));

const mockDb = require("../../../src/config/database.js");

const clinicVisitsService = require("../../../src/services/clinic_visits-service.js");

const {
  CREATE_CLINIC_VISIT,
  FIND_ALL_CLINIC_VISITS,
  FIND_CLINIC_VISIT_BY_ID,
  FIND_CLINIC_VISITS_BY_HEALTH_RECORD_ID,
  FIND_CLINIC_VISITS_BY_RECORDED_BY,
  UPDATE_CLINIC_VISIT,
  DELETE_CLINIC_VISIT,
} = require("../../../src/database/queries/clinic_visits-query.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createClinicVisit", () => {
  it("should create a clinic visit successfully", async () => {
    const mockResult = {
      insertId: 1,
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await clinicVisitsService.createClinicVisit(
      1,
      "2026-09-25",
      "08:00:00",
      "09:00:00",
      "Headache",
      "Headache and dizziness",
      "Rest and medication",
      "Patient advised to rest",
      5,
    );

    expect(mockDb.query).toHaveBeenCalledWith(CREATE_CLINIC_VISIT, [
      1,
      "2026-09-25",
      "08:00:00",
      "09:00:00",
      "Headache",
      "Headache and dizziness",
      "Rest and medication",
      "Patient advised to rest",
      5,
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when health record ID is missing", async () => {
    await expect(
      clinicVisitsService.createClinicVisit(
        null,
        "2026-09-25",
        "08:00:00",
        "09:00:00",
        "Headache",
        "Headache and dizziness",
        "Rest and medication",
        "Patient advised to rest",
        5,
      ),
    ).rejects.toThrow("Health record ID, visit date, time in, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when visit date is missing", async () => {
    await expect(
      clinicVisitsService.createClinicVisit(
        1,
        null,
        "08:00:00",
        "09:00:00",
        "Headache",
        "Headache and dizziness",
        "Rest and medication",
        "Patient advised to rest",
        5,
      ),
    ).rejects.toThrow("Health record ID, visit date, time in, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when time in is missing", async () => {
    await expect(
      clinicVisitsService.createClinicVisit(
        1,
        "2026-09-25",
        null,
        "09:00:00",
        "Headache",
        "Headache and dizziness",
        "Rest and medication",
        "Patient advised to rest",
        5,
      ),
    ).rejects.toThrow("Health record ID, visit date, time in, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when recorded by is missing", async () => {
    await expect(
      clinicVisitsService.createClinicVisit(
        1,
        "2026-09-25",
        "08:00:00",
        "09:00:00",
        "Headache",
        "Headache and dizziness",
        "Rest and medication",
        "Patient advised to rest",
        null,
      ),
    ).rejects.toThrow("Health record ID, visit date, time in, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findAllClinicVisits", () => {
  it("should return all clinic visits", async () => {
    const mockRows = [
      {
        clinic_visit_id: 1,
        health_record_id: 1,
        visit_date: "2026-09-25",
        time_in: "08:00:00",
        time_out: "09:00:00",
        reason: "Headache",
        symptoms: "Headache and dizziness",
        treatment: "Rest and medication",
        remarks: "Patient advised to rest",
        recorded_by: 5,
      },
      {
        clinic_visit_id: 2,
        health_record_id: 2,
        visit_date: "2026-09-25",
        time_in: "10:00:00",
        time_out: "10:30:00",
        reason: "Stomach ache",
        symptoms: "Abdominal pain",
        treatment: "First aid",
        remarks: null,
        recorded_by: 6,
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await clinicVisitsService.findAllClinicVisits();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_CLINIC_VISITS);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no clinic visits exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await clinicVisitsService.findAllClinicVisits();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_CLINIC_VISITS);

    expect(result).toEqual([]);
  });
});

describe("findClinicVisitById", () => {
  it("should return a clinic visit by ID", async () => {
    const mockClinicVisit = {
      clinic_visit_id: 1,
      health_record_id: 1,
      visit_date: "2026-09-25",
      time_in: "08:00:00",
      time_out: "09:00:00",
      reason: "Headache",
      symptoms: "Headache and dizziness",
      treatment: "Rest and medication",
      remarks: "Patient advised to rest",
      recorded_by: 5,
    };

    mockDb.query.mockResolvedValueOnce([[mockClinicVisit]]);

    const result = await clinicVisitsService.findClinicVisitById(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISIT_BY_ID, [1]);

    expect(result).toEqual(mockClinicVisit);
  });

  it("should return null when the clinic visit does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await clinicVisitsService.findClinicVisitById(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISIT_BY_ID, [999]);

    expect(result).toBeNull();
  });

  it("should throw an error when ID is missing", async () => {
    await expect(clinicVisitsService.findClinicVisitById()).rejects.toThrow("Clinic visit ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findClinicVisitsByHealthRecordId", () => {
  it("should return clinic visits by health record ID", async () => {
    const mockRows = [
      {
        clinic_visit_id: 1,
        health_record_id: 1,
        visit_date: "2026-09-25",
        time_in: "08:00:00",
        time_out: "09:00:00",
        reason: "Headache",
        symptoms: "Headache and dizziness",
        treatment: "Rest and medication",
        remarks: "Patient advised to rest",
        recorded_by: 5,
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await clinicVisitsService.findClinicVisitsByHealthRecordId(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISITS_BY_HEALTH_RECORD_ID, [1]);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no visits match the health record ID", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await clinicVisitsService.findClinicVisitsByHealthRecordId(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISITS_BY_HEALTH_RECORD_ID, [999]);

    expect(result).toEqual([]);
  });

  it("should throw an error when health record ID is missing", async () => {
    await expect(clinicVisitsService.findClinicVisitsByHealthRecordId()).rejects.toThrow(
      "Health record ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findClinicVisitsByRecordedBy", () => {
  it("should return clinic visits by recorded by staff ID", async () => {
    const mockRows = [
      {
        clinic_visit_id: 1,
        health_record_id: 1,
        visit_date: "2026-09-25",
        time_in: "08:00:00",
        time_out: "09:00:00",
        reason: "Headache",
        symptoms: "Headache and dizziness",
        treatment: "Rest and medication",
        remarks: "Patient advised to rest",
        recorded_by: 5,
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await clinicVisitsService.findClinicVisitsByRecordedBy(5);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISITS_BY_RECORDED_BY, [5]);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no visits match the staff ID", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await clinicVisitsService.findClinicVisitsByRecordedBy(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISITS_BY_RECORDED_BY, [999]);

    expect(result).toEqual([]);
  });

  it("should throw an error when recorded by staff ID is missing", async () => {
    await expect(clinicVisitsService.findClinicVisitsByRecordedBy()).rejects.toThrow(
      "Recorded by staff ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("updateClinicVisit", () => {
  it("should update a clinic visit successfully", async () => {
    const mockResult = {
      affectedRows: 1,
      changedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await clinicVisitsService.updateClinicVisit(
      1,
      1,
      "2026-09-25",
      "08:00:00",
      "09:00:00",
      "Headache",
      "Headache and dizziness",
      "Rest and medication",
      "Updated remarks",
      5,
    );

    expect(mockDb.query).toHaveBeenCalledWith(UPDATE_CLINIC_VISIT, [
      1,
      "2026-09-25",
      "08:00:00",
      "09:00:00",
      "Headache",
      "Headache and dizziness",
      "Rest and medication",
      "Updated remarks",
      5,
      1,
    ]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(
      clinicVisitsService.updateClinicVisit(
        null,
        1,
        "2026-09-25",
        "08:00:00",
        "09:00:00",
        "Headache",
        "Headache and dizziness",
        "Rest and medication",
        "No remarks",
        5,
      ),
    ).rejects.toThrow("Clinic ID, Health record ID, visit date, time in, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when health record ID is missing", async () => {
    await expect(
      clinicVisitsService.updateClinicVisit(
        1,
        null,
        "2026-09-25",
        "08:00:00",
        "09:00:00",
        "Headache",
        "Headache and dizziness",
        "Rest and medication",
        "No remarks",
        5,
      ),
    ).rejects.toThrow("Clinic ID, Health record ID, visit date, time in, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when visit date is missing", async () => {
    await expect(
      clinicVisitsService.updateClinicVisit(
        1,
        1,
        null,
        "08:00:00",
        "09:00:00",
        "Headache",
        "Headache and dizziness",
        "Rest and medication",
        "No remarks",
        5,
      ),
    ).rejects.toThrow("Clinic ID, Health record ID, visit date, time in, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when time in is missing", async () => {
    await expect(
      clinicVisitsService.updateClinicVisit(
        1,
        1,
        "2026-09-25",
        null,
        "09:00:00",
        "Headache",
        "Headache and dizziness",
        "Rest and medication",
        "No remarks",
        5,
      ),
    ).rejects.toThrow("Clinic ID, Health record ID, visit date, time in, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when recorded by is missing", async () => {
    await expect(
      clinicVisitsService.updateClinicVisit(
        1,
        1,
        "2026-09-25",
        "08:00:00",
        "09:00:00",
        "Headache",
        "Headache and dizziness",
        "Rest and medication",
        "No remarks",
        null,
      ),
    ).rejects.toThrow("Clinic ID, Health record ID, visit date, time in, and recorded by are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("deleteClinicVisit", () => {
  it("should delete a clinic visit successfully", async () => {
    const mockResult = {
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await clinicVisitsService.deleteClinicVisit(1);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_CLINIC_VISIT, [1]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(clinicVisitsService.deleteClinicVisit()).rejects.toThrow("Clinic visit ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should return the database result when no clinic visit was deleted", async () => {
    const mockResult = {
      affectedRows: 0,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await clinicVisitsService.deleteClinicVisit(999);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_CLINIC_VISIT, [999]);

    expect(result).toEqual(mockResult);
  });
});
