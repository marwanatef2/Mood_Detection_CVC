import numpy as np
import cv2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Flatten
from tensorflow.keras.layers import Conv2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import MaxPooling2D
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from scipy.spatial import distance as dist
from imutils.video import VideoStream, FPS
from imutils import face_utils
import imutils
from datetime import datetime
import dlib


# return Mouth Aspect Ratio (vertical : horizontal)
def smile_mar(mouth):
    A = dist.euclidean(mouth[3], mouth[9])
    B = dist.euclidean(mouth[2], mouth[10])
    C = dist.euclidean(mouth[4], mouth[8])
    avg = (A+B+C)/3
    D = dist.euclidean(mouth[0], mouth[6])
    mar = avg/D
    return mar


def calc_video_score(video_path=None):
    points = 0
    mean = []

    # Create the model
    model = Sequential()

    model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48, 48, 1)))
    model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    model.add(Flatten())
    model.add(Dense(1024, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(7, activation='softmax'))

    # load weight for the model
    model.load_weights('model.h5')

    # prevents openCL usage and unnecessary logging messages
    cv2.ocl.setUseOpenCL(False)

    # dictionary which assigns each label an emotion (alphabetical order)
    emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful",
                    3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}

    # detecting "mouth" on "face"
    shape_predictor = "shape_predictor_68_face_landmarks.dat"
    # shape_predictor = (r"D:\Projects\OpenCVPracticing\Emotion-detection\src\shape_predictor_68_face_landmarks.dat")
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(shape_predictor)
    (mStart, mEnd) = face_utils.FACIAL_LANDMARKS_IDXS["mouth"]

    # capture video
    cap = cv2.VideoCapture(video_path)
    # cap = cv2.VideoCapture(0)
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    video_path = './videos/'
    video_title = video_path + datetime.now().strftime('%a %d-%b-%Y %I-%M%p') + '.avi'
    output_video = cv2.VideoWriter(video_title, fourcc, 20.0, (640, 480))

    while cap.isOpened():
        # capture frames from video
        ret, frame = cap.read()
        if not ret:
            break

        # Find haar cascade to draw bounding box around face
        facecasc = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facecasc.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

        # detect faces for smile detection
        rects = detector(gray, 0)

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y-50), (x+w, y+h+10), (255, 0, 0), 2)
            roi_gray = gray[y: y+h, x: x+w]
            roi_color = frame[y: y+h, x: x+w]
            cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0)
            prediction = model.predict(cropped_img)
            maxindex = int(np.argmax(prediction))
            cv2.putText(frame, emotion_dict[maxindex], (x+20, y-60),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

            for rect in rects:
                shape = predictor(gray, rect)
                face = face_utils.shape_to_np(shape)
                mouth = face[mStart:mEnd]
                mar = smile_mar(mouth)
                mean.append(mar)
                mouthHull = cv2.convexHull(mouth)
                cv2.drawContours(frame, [mouthHull], -1, (0, 255, 0), 1)

                # incrementing score for "happy" mood detection and smiling/laughing
                if emotion_dict[maxindex] == 'Happy':
                    if mar <= 0.3:
                        points += 2
                    elif mar > 0.35:
                        points += 5

                cv2.putText(frame, "Score: {}".format(points), (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        output_video.write(frame)
        # cv2.imshow('Video', cv2.resize(frame,(1000,600),interpolation = cv2.INTER_CUBIC))
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

    cap.release()
    output_video.release()
    cv2.destroyAllWindows()

    mean = np.array(mean)
    avg = np.mean(mean)
    return points
