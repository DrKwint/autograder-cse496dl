import glob
import os
from os import listdir
from os.path import isfile, join
import argparse

from tqdm import tqdm
from PIL import Image
import numpy as np

parser = argparse.ArgumentParser(
    description='Turns a directory of images into numpy arrays.')
parser.add_argument('--dir', type=str)
parser.add_argument('--output_path', type=str)
parser.add_argument('--file_type', type=str, default='png')
args = parser.parse_args()


#imports data
def unpickle(file):
    import pickle
    with open(file, 'rb') as fo:
        dic = pickle.load(fo, encoding='bytes')
    return dic


def load_image(filename):
    img = Image.open(filename)
    img.load()
    data = np.asarray(img, dtype="uint8")
    return data


def load_dir_imgs(dir_path, file_type):
    filepaths = glob.glob(os.path.join(dir_path, "*.{}".format(file_type)))
    ndarray_list = [load_image(f) for f in tqdm(filepaths)]
    return np.stack(ndarray_list)


def main():
    pass
    # np.save(args.output_path, load_dir_imgs(args.dir, args.file_type))


if __name__ == "__main__":
    main()
