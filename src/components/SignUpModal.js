import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  signupInitialize,
  signupThunk,
  emailValidation,
  usernameValidation,
  validationInitialize,
} from '../modules/sign';
import {
  IsValidateEmail,
  IsValidiateUsername,
  IsValidiatePassword,
} from '../util/validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import Creatable from 'react-select/creatable';
import emailOptions from '../util/emaiOptions';

const customStyles = {
  container: (provided, state) => ({
    ...provided,
    width: 160,
    height: 45,
    border: '1px #214bc8 solid',
    borderLeft: 'none',
    display: 'flex',
    background: 'white',
    boxSizing: 'border-box',
  }),

  control: () => ({
    display: 'flex',
    flex: 1,
    width: 40,
  }),

  placeholder: (provided) => ({
    ...provided,
    color: 'rgba(0, 0, 0, 0.5)',
    fontSize: 13,
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },

  valueContainer: (provided) => ({
    ...provided,
    fontSize: 13,
    fontFamily: 'Noto Sans KR',
    paddingLeft: 0,
  }),

  menu: (provided) => ({
    ...provided,
    border: '1px #214bc8 solid',
    borderRadius: 2,
    marginTop: 9,
    fontFamily: 'Noto Sans KR',
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    fontSize: 10,
  }),
};

function SignUpModal(props) {
  const { isSignupSuccess, signupError } = useSelector(
    (state) => state.signReducer
  );
  const dispatch = useDispatch();
  const [signUpInfo, setSignUpInfo] = useState({
    email: '',
    emailService: '',
    pwd: '',
    pwdCheck: '',
    username: '',
  });

  const [message, setMessage] = useState({
    email: '',
    pwd: '',
    pwdCheck: '',
    username: '',
    overall: '',
  });

  useEffect(() => {
    const { email, username, overall } = signupError;

    if (email) {
      setMessage({
        ...message,
        email: signupError.email,
      });
    }

    if (username) {
      setMessage({
        ...message,
        username: signupError.username,
      });
    }

    if (overall) {
      setMessage({
        ...message,
        overall: signupError.overall,
      });
    }
  }, [signupError]);

  useEffect(() => {
    const { email, username } = isSignupSuccess;
    if (email) {
      setMessage({
        ...message,
        email: '사용할 수 있는 이메일',
      });
    }

    if (username) {
      setMessage({
        ...message,
        username: '사용할 수 있는 유저네임',
      });
    }
  }, [isSignupSuccess]);

  useEffect(() => {
    const { overall } = isSignupSuccess;
    if (overall) {
      props.setModalMode('successSignup');
      dispatch(signupInitialize());
    }
  }, [isSignupSuccess]);

  const handleSignUpInputChange = (e) => {
    const { name, value } = e.target;
    const { email, username } = isSignupSuccess;

    if (name === 'email') {
      if (email) {
        dispatch(validationInitialize('email'));
      }
      setSignUpInfo({
        ...signUpInfo,
        email: value,
      });
      return;
    }

    if (username && name === 'username') {
      dispatch(validationInitialize('username'));
    }

    setSignUpInfo((state) => {
      state[name] = value;
      switch (name) {
        case 'pwd':
          if (!IsValidiatePassword(state.pwd)) {
            setMessage({
              ...message,
              pwd: '8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.',
            });
          } else {
            setMessage({
              ...message,
              pwd: '',
            });
          }
          break;
        case 'pwdCheck':
          if (state.pwd !== state.pwdCheck) {
            setMessage({
              ...message,
              pwdCheck: '비밀번호가 일치하지 않습니다.',
            });
          } else {
            setMessage({
              ...message,
              pwdCheck: '',
            });
          }
          break;
        case 'username':
          if (!IsValidiateUsername(state.username)) {
            setMessage({
              ...message,
              username: '4~16자 영문 대 소문자, 숫자를 사용하세요.',
            });
          } else {
            setMessage({
              ...message,
              username: '',
            });
          }
          break;
        default:
          break;
      }
      return state;
    });
  };

  const handleEmailServiceInputChange = (newValue, actionMeta) => {
    setSignUpInfo({
      ...signUpInfo,
      emailService: newValue,
    });
  };

  const handleSignUp = () => {
    const { email, emailService, pwd, pwdCheck, username } = signUpInfo;
    if (!email || !emailService || !pwd || !pwdCheck || !username) {
      setMessage({
        ...message,
        overall: '모든 항목은 필수입니다',
      });
      return;
    }

    if (!isSignupSuccess.email || !isSignupSuccess.username) {
      setMessage({
        ...message,
        overall: '이메일, 유저네임 중복확인을 먼저 해주세요!',
      });
      return;
    }

    dispatch(signupThunk(signUpInfo));
    setSignUpInfo({
      ...signUpInfo,
      email: '',
      emailService: '',
      pwd: '',
      pwdCheck: '',
      username: '',
    });
    setMessage({
      email: '',
      pwd: '',
      pwdCheck: '',
      username: '',
      overall: '',
    });
  };

  const handleValidiateEmail = () => {
    if (!signUpInfo.emailService.value || !signUpInfo.email) {
      setMessage({ ...message, email: '모든 항목은 필수 입니다' });
      return;
    }

    const email = signUpInfo.email + '@' + signUpInfo.emailService.value;
    if (!IsValidateEmail(email)) {
      setMessage({
        ...message,
        email: '잘못된 이메일 형식입니다.',
      });
      return;
    }
    dispatch(emailValidation(email));
  };

  const handleValidiateUsername = () => {
    const { username } = signUpInfo;
    if (username.length === 0 || !IsValidiateUsername(username)) {
      setMessage({
        ...message,
        username: '올바른 유저네임을 입력해주세요!',
      });
      return;
    }
    dispatch(usernameValidation(username));
  };

  return (
    <div className="modalpage">
      <div className="signUpmodal__modalWrapper">
        <div
          className="closeBtn"
          onClick={() => {
            props.setModalMode('');
            dispatch(signupInitialize());
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>

        <div className="logo"> Recollect </div>
        <div className="signUpmodal__inputContainer email">
          <input
            className="signUpmodal__inputs email"
            type="email"
            name="email"
            value={signUpInfo.email}
            placeholder=" 이메일"
            onChange={(e) => {
              handleSignUpInputChange(e);
            }}
          />
          <span className="signUpmodal__atSign">@</span>
          <Creatable
            isClearable
            options={emailOptions}
            name="emailService"
            onChange={handleEmailServiceInputChange}
            value={signUpInfo.emailService}
            styles={customStyles}
            placeholder="선택 또는 직접입력"
          />
          <button
            className="signUpmodal__duplicatedCheckBtn"
            onClick={handleValidiateEmail}
          >
            중복확인
          </button>
        </div>
        <div
          className={`signUpmodal__messageContainer ${
            isSignupSuccess.email && 'valid'
          }`}
        >
          {message.email}
        </div>
        <div className="signUpmodal__inputContainer pwd">
          <input
            className="signUpmodal__inputs pwd"
            type="password"
            name="pwd"
            value={signUpInfo.pwd}
            placeholder=" 비밀번호"
            onChange={(e) => {
              handleSignUpInputChange(e);
            }}
          />
          <FontAwesomeIcon className="signUpmodal__faLock" icon={faLock} />
        </div>
        <div className="signUpmodal__messageContainer">{message.pwd}</div>
        <div className="signUpmodal__inputContainer pwdCheck">
          <input
            className="signUpmodal__inputs pwdCheck"
            type="password"
            name="pwdCheck"
            value={signUpInfo.pwdCheck}
            placeholder=" 비밀번호 확인"
            onChange={(e) => {
              handleSignUpInputChange(e);
            }}
          />
          <FontAwesomeIcon className="signUpmodal__faLock" icon={faLock} />
          <FontAwesomeIcon className="signUpmodal__faCheck" icon={faCheck} />
        </div>
        <div className="signUpmodal__messageContainer">{message.pwdCheck}</div>
        <div className="signUpmodal__inputContainer username">
          <input
            className="signUpmodal__inputs username"
            type="text"
            name="username"
            value={signUpInfo.username}
            placeholder=" 유저네임"
            onChange={(e) => {
              handleSignUpInputChange(e);
            }}
          />
          <button
            className="signUpmodal__duplicatedCheckBtn"
            onClick={handleValidiateUsername}
          >
            중복확인
          </button>
        </div>
        <div
          className={`signUpmodal__messageContainer ${
            isSignupSuccess.username && 'valid'
          }`}
        >
          {message.username}
        </div>
        <button className="signUpmodal__createBtn" onClick={handleSignUp}>
          계정 만들기
        </button>
        <div className="signUpmodal__messageContainer overall">
          {message.overall}
        </div>
      </div>
    </div>
  );
}

export default SignUpModal;
