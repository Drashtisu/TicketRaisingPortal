import { useEffect ,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProfile, clearError } from './authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
    console.log(dispatch)
  }, [dispatch]);

  return (
    <div className="page-card">
      <h2>Profile</h2>
      {loading ? <p>Loading profile</p> : user ? (
        <div className="profile-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Phone:</strong> {user.phone || '—'}</p>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
