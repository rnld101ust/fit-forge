import secrets
import base64
with open("pass_gen.txt", "w") as f:
    for i in range(7):
        f.write(base64.b64encode(secrets.token_bytes(24)).decode("utf-8") + "\n")
    f.write(base64.b64encode(secrets.token_bytes(756)).decode("utf-8") + "\n")
