
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
      if (this.id) {
        const updateResult = await DBManager.updateUser(this);
        return updateResult.rowCount > 0;
      } else {
        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(this.pswHash, saltRounds);
        this.pswHash = hashedPassword;
        
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
}

export default User;