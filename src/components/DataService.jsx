
import axiosInstance from './api';
class DataService {
  static BASE_URL = '/dashboard';
  static _cachedData = null;

  static async fetchAllData() {
    if (this._cachedData) {
      return this._cachedData;
    }

    try {
      const response = await axiosInstance.get(this.BASE_URL);
      const formattedData = this._formatDashboardData(response.data);
      this._cachedData = formattedData;
      return formattedData;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }

  static _formatDashboardData(rawData) {
    const groups = rawData.map(group => group.name);
    const dashboardData = rawData.reduce((acc, group) => {
      acc[group.name] = {
        sentimentData: group.sentimentData,
        engagementData: group.engagementData,
        topicsData: group.topicsData
      };
      return acc;
    }, {});

    return {
      groups,
      dashboardData
    };
  }

  static async getAllGroupsDashboardData() {
    const data = await this.fetchAllData();
    return data.dashboardData;
  }

  static async getAvailableGroups() {
    const data = await this.fetchAllData();
    return data.groups;
  }

  static async getDashboardData(group) {
    const data = await this.fetchAllData();
    if (!data.dashboardData[group]) {
      throw new Error(`Group ${group} not found`);
    }
    return data.dashboardData[group];
  }

  // Method to clear cache if needed (e.g., for testing or forcing a refresh)
  static clearCache() {
    this._cachedData = null;
  }
}

export default DataService;