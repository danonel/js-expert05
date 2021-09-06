import { jest, describe, test, expect } from "@jest/globals";
import FileHelper from "../../src/fileHelper.js";
import Routes from "../../src/routes.js";
import fs from "fs";

describe("#FileHelper suite test", () => {
  describe("#getFileStatus", () => {
    test("it should return file statusus in correct format", async () => {
      const statMock = {
        dev: 2027078073,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 281474977165679,
        size: 3137,
        blocks: 8,
        atimeMs: 1630961661494.2827,
        mtimeMs: 1630957586597.2866,
        ctimeMs: 1630957586597.2866,
        birthtimeMs: 1630961661449.2793,
        atime: "2021-09-06T20:54:21.494Z",
        mtime: "2021-09-06T19:46:26.597Z",
        ctime: "2021-09-06T19:46:26.597Z",
        birthtime: "2021-09-06T20:54:21.449Z",
      };

      const mockUser = "Daniel";
      process.env.Username = mockUser;
      const filename = "file.png";

      jest
        .spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename]);
      jest
        .spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      const result = await FileHelper.getFilesStatus("/tmp");
      const expectedResult = [
        {
          size: "3.14 kB",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename,
        },
      ];

      expect(fs.promises.stat).toHaveBeenLastCalledWith(`/tmp/${filename}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
