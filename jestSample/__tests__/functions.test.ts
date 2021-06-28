import { sumOfArray, asyncSumOfArray, asyncSumOfArraySometimesZero, getFirstNameThrowIfLong} from "../functions";
import { DatabaseMock } from '../util/index';
import { NameApiService } from '../nameApiService';
jest.mock('../util/index');
jest.mock('../nameApiService');
const MockedDatabaseMock = DatabaseMock as jest.MockedClass<
  typeof DatabaseMock
>;
const MockedNameApiService = NameApiService as jest.Mock;

const sum = require('../functions');

/* 
// sumOfArray
*/ 

test('sumOfArray: adds 1 + 2 to equal 3', () => {
  expect(sumOfArray([1, 2])).toBe(3);
});

test('sumOfArray: adds 1 + 2 + 3 to equal 6', () => {
  expect(sumOfArray([1, 2, 3])).toBe(6);
});

test('sumOfArray: adds 1 + 2 - 3 to equal 0', () => {
  expect(sumOfArray([1, 2, -3])).toBe(0);
});

// 空配列
// test('sumOfArray: empty to equal 0', () => {
  // expect(sumOfArray([])).toBe(0);
// });

// String型のため
// test('sumOfArray: adds "1" + "2" to equal 3', () => {
//   expect(sumOfArray(["1", "2"])).toBe("3");
// });

/* 
// asyncSumOfArray 
*/ 

test('asyncSumOfArray: adds 1 + 2 to equal 3', async () => {
  expect(await asyncSumOfArray([1, 2, 3])).toBe(6);
});

// 空配列
// test('asyncSumOfArray: empty to equal 0', () => {
//   expect(sumOfArray([])).toBe(0);
// });

/* 
// asyncSumOfArraySometimesZero
*/ 

// モック化し成功パターンを作る
test('asyncSumOfArraySometimesZero: saveメソッドが成功した場合 1+2=3を返す', async () => {
  MockedDatabaseMock.mockImplementation(() => {
    // saveから成功例 (何も返さない)
    return {
      save: () => {},
    };
  });
  expect(await asyncSumOfArraySometimesZero([1, 2], new MockedDatabaseMock())).toBe(3);
});

// モック化し失敗パターンを作る
test('asyncSumOfArraySometimesZero: saveメソッドが失敗した場合、何も返さない', async () => {
  MockedDatabaseMock.mockImplementation(() => {
    // saveからfail (たまにゼロになるパターン) を投げる
    return {
      save: () => {
        throw new Error('fail!');
      },
    };
  });
  expect(await asyncSumOfArraySometimesZero([1, 2], new MockedDatabaseMock())).toBe(0);
});

/* 
// asyncSumOfArraySometimesZero
*/ 

test('入力値Firstnameが指定した長さより短い、ないしは等価の場合、入力値をそのまま帰す', async () => {
  MockedNameApiService.mockImplementation(() => {
    // Deeという名前を取得できたと仮定する
    return {
      getFirstName: () => {
        return 'Dee';
      },
    };
  });
  expect(await getFirstNameThrowIfLong(10, new MockedNameApiService())).toBe(
    'Dee'
  );
  expect(await getFirstNameThrowIfLong(3, new MockedNameApiService())).toBe(
    'Dee'
  );
});

test('入力値Firstnameが指定した長さより長い場合、何も返さない', () => {
  MockedNameApiService.mockImplementation(() => {
    // Deeという名前を取得できたと仮定する
    return {
      getFirstName: () => {
        return 'Dee'
      },
    };
  });
  expect(
    async () => await getFirstNameThrowIfLong(0, new MockedNameApiService())
  ).rejects.toThrow('first_name too long');
  expect(
    async () => await getFirstNameThrowIfLong(2, new MockedNameApiService())
  ).rejects.toThrow('first_name too long');
});