import tensorflow_datasets as tfds
import numpy as np
import tensorflow as tf

tf.enable_eager_execution()

data, info = tfds.load("cifar100", with_info=True)
train = list(tfds.as_numpy(data['train']))
test = list(tfds.as_numpy(data['test']))

print("STEP 1")

train_imgs = np.array([x['image'] for x in train])
train_labels = np.array([x['label'] for x in train])

print("STEP 2")

test_imgs = np.array([x['image'] for x in test])
test_labels = np.array([x['label'] for x in test])

print("STEP 3")

np.save('cifar_images_train', train_imgs)
np.save('cifar_labels_train', train_labels)
np.save('cifar_images_test', test_imgs)
np.save('cifar_labels_test', test_labels)

print("STEP 4")
