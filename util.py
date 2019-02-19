import datetime
import os

import tensorflow as tf


def score_classification(model_directory, data, labels, path_prefix):
    tf.reset_default_graph()
    with tf.Session() as session:
        # load graph structure and weights
        saver = tf.train.import_meta_graph(
            os.path.join(model_directory, path_prefix + '.meta'))
        saver.restore(session, os.path.join(model_directory, path_prefix))

        # run model forward on test data
        y = tf.placeholder(tf.int64)
        x = session.graph.get_tensor_by_name('input_placeholder:0')
        output = session.graph.get_tensor_by_name('output:0')

        predictions_t = tf.argmax(output, axis=1)
        accuracy_t = tf.reduce_mean(
            tf.cast(tf.equal(predictions_t, y), tf.float32))
        confusion_matrix_t = tf.confusion_matrix(
            labels=y, predictions=predictions_t, num_classes=10)

        accuracy, confusion_matrix = session.run(
            [accuracy_t, confusion_matrix_t], {
                x: data,
                y: labels
            })
        return accuracy, confusion_matrix


def unix_time_millis(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    return (dt - epoch).total_seconds() * 1000.0
