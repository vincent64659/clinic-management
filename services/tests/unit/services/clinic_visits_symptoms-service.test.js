//  MOCK the db module BEFORE importing service
jest.mock("../../../src/config/database.js", () => ({
  query: jest.fn(),
}));

const mockDb = require("../../../src/config/database.js");

const clinicVisitSymptomsService = require("../../../src/services/clinic_visits_symptoms-service.js");

const {
  CREATE_CLINIC_VISIT_SYMPTOM,
  FIND_ALL_CLINIC_VISIT_SYMPTOMS,
  FIND_CLINIC_VISIT_SYMPTOM_BY_ID,
  FIND_CLINIC_VISIT_SYMPTOMS_BY_VISIT_ID,
  FIND_CLINIC_VISITS_BY_SYMPTOM_ID,
  UPDATE_CLINIC_VISIT_SYMPTOM,
  DELETE_CLINIC_VISIT_SYMPTOM,
} = require("../../../src/database/queries/clinic_visits_symptoms-query.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createClinicVisitSymptom", () => {
  it("should create a clinic visit symptom successfully", async () => {
    const mockResult = {
      insertId: 1,
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await clinicVisitSymptomsService.createClinicVisitSymptom(1, 2, "Patient reported headache");

    expect(mockDb.query).toHaveBeenCalledWith(CREATE_CLINIC_VISIT_SYMPTOM, [1, 2, "Patient reported headache"]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when clinic visit ID is missing", async () => {
    await expect(
      clinicVisitSymptomsService.createClinicVisitSymptom(null, 2, "Patient reported headache"),
    ).rejects.toThrow("Clinic visit ID and symptom ID are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should throw an error when symptom ID is missing", async () => {
    await expect(
      clinicVisitSymptomsService.createClinicVisitSymptom(1, null, "Patient reported headache"),
    ).rejects.toThrow("Clinic visit ID and symptom ID are required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findAllClinicVisitSymptoms", () => {
  it("should return all clinic visit symptoms", async () => {
    const mockRows = [
      {
        clinic_visit_symptom_id: 1,
        clinic_visit_id: 1,
        symptom_id: 2,
        notes: "Patient reported headache",
      },
      {
        clinic_visit_symptom_id: 2,
        clinic_visit_id: 1,
        symptom_id: 3,
        notes: "Patient reported dizziness",
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await clinicVisitSymptomsService.findAllClinicVisitSymptoms();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_CLINIC_VISIT_SYMPTOMS);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no clinic visit symptoms exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await clinicVisitSymptomsService.findAllClinicVisitSymptoms();

    expect(mockDb.query).toHaveBeenCalledWith(FIND_ALL_CLINIC_VISIT_SYMPTOMS);

    expect(result).toEqual([]);
  });
});

describe("findClinicVisitSymptomById", () => {
  it("should return a clinic visit symptom by ID", async () => {
    const mockClinicVisitSymptom = {
      clinic_visit_symptom_id: 1,
      clinic_visit_id: 1,
      symptom_id: 2,
      notes: "Patient reported headache",
    };

    mockDb.query.mockResolvedValueOnce([[mockClinicVisitSymptom]]);

    const result = await clinicVisitSymptomsService.findClinicVisitSymptomById(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISIT_SYMPTOM_BY_ID, [1]);

    expect(result).toEqual(mockClinicVisitSymptom);
  });

  it("should return null when the clinic visit symptom does not exist", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await clinicVisitSymptomsService.findClinicVisitSymptomById(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISIT_SYMPTOM_BY_ID, [999]);

    expect(result).toBeNull();
  });

  it("should throw an error when ID is missing", async () => {
    await expect(clinicVisitSymptomsService.findClinicVisitSymptomById()).rejects.toThrow(
      "Clinic visit symptom ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findClinicVisitSymptomsByVisitId", () => {
  it("should return clinic visit symptoms by visit ID", async () => {
    const mockRows = [
      {
        clinic_visit_symptom_id: 1,
        clinic_visit_id: 1,
        symptom_id: 2,
        notes: "Patient reported headache",
      },
      {
        clinic_visit_symptom_id: 2,
        clinic_visit_id: 1,
        symptom_id: 3,
        notes: "Patient reported dizziness",
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await clinicVisitSymptomsService.findClinicVisitSymptomsByVisitId(1);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISIT_SYMPTOMS_BY_VISIT_ID, [1]);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no symptoms match the visit ID", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await clinicVisitSymptomsService.findClinicVisitSymptomsByVisitId(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISIT_SYMPTOMS_BY_VISIT_ID, [999]);

    expect(result).toEqual([]);
  });

  it("should throw an error when clinic visit ID is missing", async () => {
    await expect(clinicVisitSymptomsService.findClinicVisitSymptomsByVisitId()).rejects.toThrow(
      "Clinic visit ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("findClinicVisitsBySymptomId", () => {
  it("should return clinic visits by symptom ID", async () => {
    const mockRows = [
      {
        clinic_visit_symptom_id: 1,
        clinic_visit_id: 1,
        symptom_id: 2,
        notes: "Patient reported headache",
      },
      {
        clinic_visit_symptom_id: 3,
        clinic_visit_id: 3,
        symptom_id: 2,
        notes: "Recurring headache",
      },
    ];

    mockDb.query.mockResolvedValueOnce([mockRows]);

    const result = await clinicVisitSymptomsService.findClinicVisitsBySymptomId(2);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISITS_BY_SYMPTOM_ID, [2]);

    expect(result).toEqual(mockRows);
  });

  it("should return an empty array when no visits match the symptom ID", async () => {
    mockDb.query.mockResolvedValueOnce([[]]);

    const result = await clinicVisitSymptomsService.findClinicVisitsBySymptomId(999);

    expect(mockDb.query).toHaveBeenCalledWith(FIND_CLINIC_VISITS_BY_SYMPTOM_ID, [999]);

    expect(result).toEqual([]);
  });

  it("should throw an error when symptom ID is missing", async () => {
    await expect(clinicVisitSymptomsService.findClinicVisitsBySymptomId()).rejects.toThrow("Symptom ID is required.");

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("updateClinicVisitSymptom", () => {
  it("should update a clinic visit symptom successfully", async () => {
    const mockResult = {
      affectedRows: 1,
      changedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await clinicVisitSymptomsService.updateClinicVisitSymptom(1, 1, 2, "Updated notes");

    expect(mockDb.query).toHaveBeenCalledWith(UPDATE_CLINIC_VISIT_SYMPTOM, [1, 2, "Updated notes", 1]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(clinicVisitSymptomsService.updateClinicVisitSymptom(null, 1, 2, "Updated notes")).rejects.toThrow(
      "Clinic visit symptom ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });
});

describe("deleteClinicVisitSymptom", () => {
  it("should delete a clinic visit symptom successfully", async () => {
    const mockResult = {
      affectedRows: 1,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await clinicVisitSymptomsService.deleteClinicVisitSymptom(1);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_CLINIC_VISIT_SYMPTOM, [1]);

    expect(result).toEqual(mockResult);
  });

  it("should throw an error when ID is missing", async () => {
    await expect(clinicVisitSymptomsService.deleteClinicVisitSymptom()).rejects.toThrow(
      "Clinic visit symptom ID is required.",
    );

    expect(mockDb.query).not.toHaveBeenCalled();
  });

  it("should return the database result when no clinic visit symptom was deleted", async () => {
    const mockResult = {
      affectedRows: 0,
    };

    mockDb.query.mockResolvedValueOnce([mockResult]);

    const result = await clinicVisitSymptomsService.deleteClinicVisitSymptom(999);

    expect(mockDb.query).toHaveBeenCalledWith(DELETE_CLINIC_VISIT_SYMPTOM, [999]);

    expect(result).toEqual(mockResult);
  });
});
