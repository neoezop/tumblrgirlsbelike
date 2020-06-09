import base64
import fleep
import os
import siphash
from backend.database import Post
import datetime

SIPHASH_KEY = b'0123456789ABCDEF'
dir_path = os.path.dirname(__file__)


class BadFormatException(Exception):
    pass


def store_image_data(image_data: str) -> str:
    image_string = base64.b64decode(image_data)
    file_extensions = fleep.get(image_string).extension
    allowable_extensions = ['png', 'jpg']

    if len(file_extensions) == 0 or file_extensions[0] not in allowable_extensions:
        raise BadFormatException(f"file should be one of these: {', '.join(allowable_extensions)}")

    post_key = generate_post_key(image_data)
    file_path = os.path.join(dir_path, 'content_storage', f'{post_key}.{file_extensions[0]}')
    with open(file_path, 'wb') as f:
        f.write(image_string)
    return post_key, file_extensions[0]


def generate_post_key(image_data) -> str:
    s = str(datetime.datetime.now()) + str(len(image_data))
    return siphash.SipHash_2_4(SIPHASH_KEY, bytearray(s.encode('utf-8'))).hexdigest().decode('utf-8')


def get_post_file(post: Post):
    filename = f'{post.post_key}.{post.file_extension}'

    path = os.path.join(dir_path, 'content_storage', filename)
    with open(path, 'rb') as f:
        data = base64.b64encode(f.read()).decode('utf-8')
        return data


def delete_image_from_storage(post: Post):
    file_path = os.path.join(dir_path, 'content_storage', f'{post.post_key}.{post.file_extension}')
    if os.path.exists(file_path):
        os.remove(file_path)
