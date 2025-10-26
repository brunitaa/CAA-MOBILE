import api from "../api/axios";

export class PictogramService {
  constructor(token) {
    this.token = token;
  }

  _getAuthHeader() {
    return { Authorization: `Bearer ${this.token}` };
  }

  async getAllPictograms(selectedSpeaker) {
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

  async getArchivedPictograms() {
    const { data } = await api.get("/pictograms/archived", {
      headers: this._getAuthHeader(),
    });
    return data;
  }

  async getPictogramById(id) {
    const { data } = await api.get(`/pictograms/${id}`, {
      headers: this._getAuthHeader(),
    });
    return data;
  }

  async createPictogram(formData, selectedSpeaker) {
    console.log(
      "Creando pictograma para speaker:",
      selectedSpeaker?.id || "global"
    );

    const { data } = await api.post(
      "/pictograms/create",
      {
        ...formData,
        speakerId: selectedSpeaker?.id || null,
      },
      {
        headers: {
          ...this._getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Pictograma creado:", data);
    return data;
  }

  async updatePictogram(id, formData) {
    const { data } = await api.put(`/pictograms/edit/${id}`, formData, {
      headers: {
        ...this._getAuthHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  }

  async deletePictogram(id) {
    const { data } = await api.delete(`/pictograms/delete/${id}`, {
      headers: this._getAuthHeader(),
    });
    return data;
  }

  async restorePictogram(id) {
    const { data } = await api.patch(`/pictograms/restore/${id}`, null, {
      headers: this._getAuthHeader(),
    });
    return data;
  }

  async getAllPos() {
    const { data } = await api.get("/pictograms/dropdown/pos", {
      headers: this._getAuthHeader(),
    });
    return data;
  }

  async getAllSemanticCategories() {
    const { data } = await api.get("/pictograms/dropdown/semantic", {
      headers: this._getAuthHeader(),
    });
    return data;
  }
}
