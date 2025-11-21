const dbs = {
    DEV: 'DEV',
    TEST_H: 'TEST_H',
    TEST_E: 'TEST_E',
    PROD: 'productionv1',
  };
  
  const DB = dbs.DEV;
  let connectionString = null;
  if (DB === dbs.PROD) {
    connectionString = `mongodb://localhost:27017/testdb`;
  } else {
    connectionString = `mongodb://localhost:27017/testdb`;
  }
  
  export const MONGO_CONN_STR = connectionString;
  export const port = 4000;