def test_password_hashing():
    from flask_bcrypt import Bcrypt

    bcrypt = Bcrypt()

    password = "123456"

    hashed = bcrypt.generate_password_hash(password).decode()

    assert hashed != password
    assert bcrypt.check_password_hash(hashed, password)