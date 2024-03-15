import DBManager from "./storageManager.mjs"
import bcrypt from 'bcrypt';

class User {

  constructor() {
    this.email;
    this.pswHash;
    this.name;
    this.id;
  }
// NOT USED??
  static async authenticate(email, password) {
    try {
      const user = await DBManager.findByEmail(email);
      if (!user) {
        return null;
      }
      const isPasswordValid = await user.verifyPassword(password);
      if (!isPasswordValid) {
        return null; 
      }

      return user;
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
        return !!existingUser;
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
      const isTokenValid = verifyToken(this.token);
      if (!isTokenValid) {
        throw new Error('Invalid token. Authentication failed.');
      }

      const updateResult = await DBManager.updateUser(this);
      return updateResult.rowCount > 0;
    } else {
      const saltRounds = 10;
      console.log('Original password:', this.pswHash);
      this.pswHash = await bcrypt.hash(this.pswHash, saltRounds);
      console.log('Hashed password:', this.pswHash);
      await DBManager.createUser(this);
    }
  } catch (error) {
    throw error;
  }
}
  async delete() {
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
  }
}

async getStats() {
  try {
      return await DBManager.getStats(this.id);
  } catch (error) {
  }
}
async getUser() {
  try {
      return await DBManager.getOneUser(this.id);
  } catch (error) {
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