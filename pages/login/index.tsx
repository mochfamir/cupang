import { useRouter } from "next/router";
import {
  getAuth,
  GoogleAuthProvider,
  provider,
  signInWithPopup,
} from "@libs/firebase";
import { useEffect, useState } from "react";
import { Button, Col, Row, Spin } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function login() {
    setIsLoading(true);
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        setIsLoading(false);
        router.push("/");
        console.log(user, token);

        // ...
      })
      .catch((error) => {
        setIsLoading(false);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  return (
    <Row justify='center' align='middle' style={{ height: "100vh" }}>
      <Col>
        {!isLoading ? (
          <Button type='primary' icon={<GoogleOutlined />} onClick={login}>
            Login
          </Button>
        ) : (
          <>
            Loading.. <Spin />
          </>
        )}
      </Col>
    </Row>
  );
};

export default LoginPage;