import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import main from '../assets/main.svg';
import { useGlobalContext } from '../context';
function Home() {
  const { user } = useGlobalContext();
  return (
    <>
      {user && <Redirect to="/dashboard" />}
      <Wrapper className="page">
        <div className="info">
          <h2>
            <span>Aplikasih </span>
            Itb swadarma
          </h2>
          <p>hallo bro selamat datang di aplikash sederhanaku</p>
          <p>Hallo selamat datang di aplikash sederhanaku</p>

          <Link to="/login" className="btn">
            Login
          </Link>
          <Link to="/register" className="btn">
            Register
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: grid;
  align-items: center;
  h2 {
    font-weight: 700;
  }
  h2 span {
    color: var(--primary-500);
  }
  .main-img {
    display: none;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 6rem;
    .main-img {
      display: block;
    }
  }
  .btn {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
`;

export default Home;
