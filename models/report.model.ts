import instance from '@/utils/axios.utils';

const report = {
    funnelCount: (data) => {
        let promise = new Promise((resolve, reject) => {
            let url = `countdetails/`;
            instance()
                .post(url,data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.message);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    reportLead: (data) => {
        let promise = new Promise((resolve, reject) => {
            let url = `report_lead/`;
            instance()
                .post(url,data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.message);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    reportStage: () => {
        let promise = new Promise((resolve, reject) => {
            let url = `report_stage/`;
            instance()
                .post(url)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.message);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },

    reportOpportunity: (data) => {
        let promise = new Promise((resolve, reject) => {
            let url = `opportunity/chart/`;
            instance()
                .post(url, data)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    if (error.response) {
                        reject(error.response.message);
                    } else {
                        reject(error);
                    }
                });
        });
        return promise;
    },
};

export default report;
