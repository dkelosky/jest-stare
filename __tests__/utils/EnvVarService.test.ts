import { EnvVarService } from "../../src/utils/EnvVarService";

describe("EnvVarService tests", () => {

    it("should read my env value", () => {
        const value = "acbd1234";
        const prefix = "MY_TEST_PREFIX_";
        const suffix = "SUFFIX";
        const envVar = prefix + suffix;
        process.env[envVar] = value;
        const envService = new EnvVarService("MY_TEST_PREFIX_");
        const result = envService.readEnvValue("SUFFIX");
        expect(result).toBe(value);
    });

    it("should not find unset env value", () => {
        const value = "acbd1234";
        const prefix = "MY_TEST_PREFIX_";
        const suffix = "SUFFIX";
        const envVar = prefix + suffix;
        process.env[envVar] = value;
        const envService = new EnvVarService("MY_TEST_PREFIX_");
        const result = envService.readEnvValue("SOMETHING_ELSE");
        expect(result).toBeUndefined();
    });

    it("should read my env value that is boolean set to true", () => {
        const value = "true";
        const prefix = "MY_TEST_PREFIX_";
        const suffix = "SUFFIX";
        const envVar = prefix + suffix;
        process.env[envVar] = value;
        const envService = new EnvVarService("MY_TEST_PREFIX_");
        const result = envService.readBoolEnvValue("SUFFIX");
        expect(result).toBe(true);
    });

    it("should read my env value that is boolean set to false", () => {
        const value = "0";
        const prefix = "MY_TEST_PREFIX_";
        const suffix = "SUFFIX";
        const envVar = prefix + suffix;
        process.env[envVar] = value;
        const envService = new EnvVarService("MY_TEST_PREFIX_");
        const result = envService.readBoolEnvValue("SUFFIX");
        expect(result).toBe(false);
    });


    it("should not find my env value that is not set", () => {
        const value = "0";
        const prefix = "MY_TEST_PREFIX_";
        const suffix = "SUFFIX";
        const envVar = prefix + suffix;
        process.env[envVar] = value;
        const envService = new EnvVarService("MY_TEST_PREFIX_");
        const result = envService.readBoolEnvValue("SOMETHING_ELSE");
        expect(result).toBeUndefined();
    });
});
