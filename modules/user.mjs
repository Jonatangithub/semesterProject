import DBManager from "./storageManager.mjs"
import bcrypt from 'bcrypt';

class User {

  constructor() {
    //TODO: Add username and avatar
    this.email;
    this.pswHash;
    this.name;
    this.id;
  }
  static async authenticate(email, password) {
    try {
      const user = await DBManager.findByEmail(email);
      if (!user) {
        return null; // User not found
      }

      const isPasswordValid = await user.verifyPassword(password);
      if (!isPasswordValid) {
        return null; // Password incorrect
      }

      return user; // Authentication successful
    } catch (error) {
      throw error;
    }
  }
  async getUsers() {
    const users = await DBManager.getAllUsers()
    return users;
  }
  static async isEmailTaken(email) {
    try {
        const existingUser = await DBManager.findByEmail(email);
        return !!existingUser; // Convert to boolean (true if user exists, false if not)
    } catch (error) {
        throw error;
    }
}
async verifyPassword(password) {
  try {
      console.log('Comparing passwords:', this.pswHash, password);
      const isPasswordValid = await bcrypt.compare(password, this.pswHash);
      console.log('Password validation result:', isPasswordValid);
      return isPasswordValid;
  } catch (error) {
      console.error('Error during password verification:', error);
      throw error;
  }
}
async save() {
  try {
    console.log('Saving user with ID:', this.id);
    if (this.id) {
      if (!this.token) {
        throw new Error('Token is required for authentication.');
      }

      // Assuming you have a method to verify the token
      const isTokenValid = verifyToken(this.token);
      if (!isTokenValid) {
        throw new Error('Invalid token. Authentication failed.');
      }

      const updateResult = await DBManager.updateUser(this);
      return updateResult.rowCount > 0;
    } else {
      console.log("shit not workin fam")
      // Hash the password before saving
      const saltRounds = 10;
      // Logging to check the value of this.pswHash
      console.log('Original password:', this.pswHash);

      // Assuming the original password is stored in this.pswHash
      this.pswHash = await bcrypt.hash(this.pswHash, saltRounds);

      // Logging to check the hashed password
      console.log('Hashed password:', this.pswHash);

      await DBManager.createUser(this);
    }
  } catch (error) {
    throw error;
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
async updateStats(wins, draws, losses) {
  try {
      await DBManager.updateStats(this.id, wins, draws, losses);
  } catch (error) {
      // TODO: Handle error
  }
}

async getStats() {
  try {
      return await DBManager.getStats(this.id);
  } catch (error) {
      // TODO: Handle error
  }
}

async trackGameResult(result) {
  const stats = await this.getStats();

  if (result.includes("win")) {
      await this.updateStats(stats.wins + 1, stats.draws, stats.losses);
  } else if (result.includes("draw")) {
      await this.updateStats(stats.wins, stats.draws + 1, stats.losses);
  } else {
      await this.updateStats(stats.wins, stats.draws, stats.losses + 1);
  }
}

}

export default User;