import api from "../api/axios";

export class PictogramService {
  constructor(token) {
    this.token = token;
  }

  _getAuthHeader() {
    return { Authorization: `Bearer ${this.token}` };
  }

  async getAllPictogramsRequest(selectedSpeaker) {
    if (!selectedSpeaker || !selectedSpeaker.id) {
    } else {
    }

    const { data } = await api.get("/pictograms", {
      params: {
        speakerId: selectedSpeaker?.id || null,
      },
      headers: this._getAuthHeader(),
    });

    return data;
  }

  async getArchivedPictogramsRequest() {
    const { data } = await api.get("/pictograms/archived", {
      headers: this._getAuthHeader(),
    });
    return data;
  }

  async getPictogramByIdRequest(id) {
    const { data } = await api.get(`/pictograms/${id}`, {
      headers: this._getAuthHeader(),
    });
    return data;
  }

  async updatePictogramCaregiverRequest(id, formData) {
    const { data } = await api.put(
      `/pictograms/edit/caregiver/${id}`,
      formData,
      {
        headers: {
          ...this._getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  }
  async updatePictogramSpeakerRequest(id, formData) {
    const { data } = await api.put(`/pictograms/edit/speaker/${id}`, formData, {
      headers: {
        ...this._getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  async deletePictogramRequest(id) {
    const { data } = await api.delete(`/pictograms/delete/${id}`, {
      headers: this._getAuthHeader(),
    });
    return data;
  }

  async restorePictogramRequest(id) {
    const { data } = await api.patch(`/pictograms/restore/${id}`, null, {
      headers: this._getAuthHeader(),
    });
    return data;
  }

  async getAllPosRequest() {
    const { data } = await api.get("/pos", {
      headers: this._getAuthHeader(),
    });
    return data;
  }
}

export const createPictogramRequest = async (formData) => {
  console.log("API: enviando pictograma...");
  console.log(formData);
  return api.post("/pictograms/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
