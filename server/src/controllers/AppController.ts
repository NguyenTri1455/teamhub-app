import { Request, Response } from "express";

class AppController {
    static checkStatus = async (req: Request, res: Response) => {
        // Simple endpoint to check if app API is valid
        res.send({ status: "ok", message: "App API is running" });
    };

    static getAppConfig = async (req: Request, res: Response) => {
        // Return app-specific configuration
        res.send({
            version: "1.0.0",
            features: {
                notifications: true,
                offlineMode: false
            }
        });
    }
}

export default AppController;
