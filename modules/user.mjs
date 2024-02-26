import DBManager from "./storageHandler.mjs";

class User {

  constructor() {
    //TODO: Add username and avatar
    this.email;
    this.pswHash;
    this.name;
    this.id;
  }

  static async authenticate(email, password) {
    const user = await DBManager.authenticateUser(email, password);
    return user;
  }

  async getUsers() {
    const users = await DBManager.getAllUsers()
    return users;
  }

  async save() {
    if (this.id) {
      try {
        const updateResult = await DBManager.updateUser(this);
        return updateResult.rowCount > 0;
      }
      catch (error) {
        throw error;
      }
    } else {
      await DBManager.createUser(this);
    }
  }

  async delete() {
    /// TODO: What happens if the DBManager fails to complete its task?
    try {
      const deletionResult = await DBManager.deleteUser(this);
      return deletionResult.rowCount > 0;
    }
    catch (error) {
      throw error;
    }
  }
}

export default User;