import Structure from '../../components/layout/Structure';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';

const Profile = () => {
  return (
    <Structure
      headerIcon={<Icon name="Users" width="22" height="22" strokeWidth="2" />}
      headerTitle="Administrator Profile"
      headerSub="Manage your account settings, login credentials, and user preferences"
      showTabControls={false}
      quickAction={
        <div className="text-right">
          <p className="mini-text text-gray font-600 uppercase mb-2">QUICK ACTION</p>
          <p className="small-text font-600 text-primary flex items-center gap-2 decoration-none cursor-pointer">
            Edit Details
            <Icon name="ChevronRight" width="14" height="14" strokeWidth="2.5" />
          </p>
        </div>
      }
    >
      <style>{`
        .profile-wrapper {
          font-family: 'Outfit', sans-serif;
          color: #1e293b;
        }
        .profile-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 30px;
          max-width: 600px;
          margin: 0 auto;
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 24px;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-cover: cover;
        }
        .profile-info h2 {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 4px 0;
        }
        .profile-info p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
        .profile-details-grid {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 16px 12px;
          font-size: 14px;
        }
        .detail-label {
          color: #64748b;
          font-weight: 500;
        }
        .detail-value {
          color: #1e293b;
          font-weight: 600;
        }
      `}</style>
      <div className="profile-wrapper w-full pt-20">
        <div className="profile-card">
          <div className="profile-header">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" 
              alt="Sandra Marx" 
              className="profile-avatar"
            />
            <div className="profile-info">
              <h2>Sandra Marx</h2>
              <p>System Administrator</p>
            </div>
          </div>

          <div className="profile-details-grid mb-24">
            <div className="detail-label">Email Address:</div>
            <div className="detail-value">sandra@gmail.com</div>

            <div className="detail-label">Phone Number:</div>
            <div className="detail-value">+91 98765 43210</div>

            <div className="detail-label">Office Location:</div>
            <div className="detail-value">Mumbai, Maharashtra</div>

            <div className="detail-label">Access Level:</div>
            <div className="detail-value">Super Admin</div>

            <div className="detail-label">Last Login:</div>
            <div className="detail-value">04 Aug 2026, 14:15 PM</div>
          </div>

          <div className="flex gap-10">
            <Button variant="primary" version="v2">Edit Profile</Button>
            <Button variant="outline" version="v2">Reset Password</Button>
          </div>
        </div>
      </div>
    </Structure>
  );
};

export default Profile;
