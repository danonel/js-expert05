import { jest, describe, test, expect } from "@jest/globals";
import Routes from "../../src/routes.js";

describe("#Routes suite test", () => {
  const defaultParams = {
    request: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: "",
      body: {},
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    },
    values: () => Object.values(defaultParams),
  };
  describe("#setSocketInstance", () => {
    test("should set the socket instance", () => {
      const routes = new Routes();

      const ioObject = {
        to: (id) => ioObject,
        emit: (event, message) => {},
      };

      routes.setSocketInstance(ioObject);

      expect(routes.io).toStrictEqual(ioObject);
    });
  });

  describe("#handler", () => {
    test("given an inexistent route it should choose default route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      params.request.method = "inexistent";
      await routes.handler(...params.values());
      expect(params.response.end).toHaveBeenCalledWith("hello");
    });

    test("it should set any request with CORS enabled", async () => {
      const routes = new Routes();

      const params = {
        ...defaultParams,
      };

      params.request.method = "inexistent";
      await routes.handler(...params.values());
      expect(params.response.setHeader).toHaveBeenCalledWith(
        "Access-Control-Allow-Origin",
        "*"
      );
    });

    test("given method OPTIONS it should choose options route", async () => {
      const routes = new Routes();

      const params = {
        ...defaultParams,
      };

      params.request.method = "OPTIONS";

      await routes.handler(...params.values());
      expect(params.response.end).toHaveBeenCalledWith("hello");
      expect(params.response.writeHead).toHaveBeenCalledWith(204);
    });
    test("given method POST it should choose options route", async () => {
      const routes = new Routes();

      const params = {
        ...defaultParams,
      };

      params.request.method = "POST";
      jest.spyOn(routes, routes.post.name).mockResolvedValue();
      await routes.handler(...params.values());
      expect(routes.post).toHaveBeenCalled();
    });

    test("given method GET it should choose options route", async () => {
      const routes = new Routes();

      const params = {
        ...defaultParams,
      };

      params.request.method = "GET";
      jest.spyOn(routes, routes.get.name).mockResolvedValue();
      await routes.handler(...params.values());

      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe("#get", () => {
    test("given an method GET it SHOULD list all files downloaded", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };

      const filesStatusesMock = [
        {
          size: "3.14 kB",
          lastModified: "2021-09-06T20:54:21.449Z",
          owner: "Daniel",
          file: "file.txt",
        },
      ];

      jest
        .spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name)
        .mockResolvedValue(filesStatusesMock);
      params.request.method = "GET";
      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(
        JSON.stringify(filesStatusesMock)
      );
    });
  });
});
