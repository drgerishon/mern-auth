import './ChangePassword.scss';
import React, { useState } from 'react';
import Card from '../../components/card/Card';
import profileImg from '../../assets/avatarr.png';
import PageMenu from '../../components/pageMenu/PageMenu';
import PasswordInput from '../../components/passwordInput/PasswordInput';

const initialState = {
  oldPassword: "",
  password: "",
  password2: "",
};

const handleInputChange = () => {};

const ChangePassword = () => {
  const [formData, setFormData] = useState(initialState);
  const {oldPassword, password, password2} = formData;
  return (
    <>
      <section>
        <div className="container">
          <PageMenu />
          <h2>Change Password</h2>
          <div className="--flex-start change-password">
            <Card cardClass={'card'}>
              <>
                <form>
                  <p>
                    <label>Current Password:</label>
                    <PasswordInput
                      placeholder="Old Password"
                      name="password"
                      value={oldPassword}
                      onChange={handleInputChange}
                    />
                  </p>
                  <p>
                    <label>New Password:</label>
                    <PasswordInput
                      placeholder="Passsword"
                      name="password"
                      value={password}
                      onChange={handleInputChange}
                    />
                  </p>
                  <p>
                    <label>Confirm New Password:</label>
                    <PasswordInput
                      placeholder="Confirm Password"
                      name="password2"
                      value={password2}
                      onChange={handleInputChange}
                    />
                  </p>
                  <button className="--btn --btn-danger --btn-block">
                    Change Password
                  </button>
                </form>
              </>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;
