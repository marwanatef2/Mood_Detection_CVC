import numpy as np
import cv2
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense, Dropout, Flatten
# from tensorflow.keras.layers import Conv2D
# from tensorflow.keras.optimizers import Adam
# from tensorflow.keras.layers import MaxPooling2D
# from tensorflow.keras.preprocessing.image import ImageDataGenerator

from scipy.spatial import distance as dist
from imutils import face_utils
from datetime import datetime
import dlib


# return vertical and horizontal mouth distances
def smile_mar(mouth):
    A = dist.euclidean(mouth[3], mouth[9])
    B = dist.euclidean(mouth[2], mouth[10])
    C = dist.euclidean(mouth[4], mouth[8])
    avg = (A+B+C)/3
    D = dist.euclidean(mouth[0], mouth[6])
    # mar = avg/D
    return avg, D


def calc_video_score(video_path=None, stored_vert=None, stored_hori=None, video=True):
    # Create the model
    # model = Sequential()

    # model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48, 48, 1)))
    # model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
    # model.add(MaxPooling2D(pool_size=(2, 2)))
    # model.add(Dropout(0.25))

    # model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
    # model.add(MaxPooling2D(pool_size=(2, 2)))
    # model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
    # model.add(MaxPooling2D(pool_size=(2, 2)))
    # model.add(Dropout(0.25))

    # model.add(Flatten())
    # model.add(Dense(1024, activation='relu'))
    # model.add(Dropout(0.5))
    # model.add(Dense(7, activation='softmax'))

    # # load weight for the model
    # model.load_weights('model.h5')

    # # prevents openCL usage and unnecessary logging messages
    # cv2.ocl.setUseOpenCL(False)

    # # dictionary which assigns each label an emotion (alphabetical order)
    # emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful",
    #                 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}

    # detecting "mouth" on "face"
    shape_predictor = "C:\\Users\\zeezl\Desktop\\project Image\\Mood_Detection_CVC\\api\\video_processing\\shape_predictor_68_face_landmarks.dat"
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(shape_predictor)
    (mStart, mEnd) = face_utils.FACIAL_LANDMARKS_IDXS["mouth"]

    if video:
        points = 0

        # capture video
        cap = cv2.VideoCapture(video_path)
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        new_video_path = './videos/'
        video_title = new_video_path + datetime.now().strftime('%a %d-%b-%Y %I-%M%p') + '.avi'
        output_video = cv2.VideoWriter(video_title, fourcc, 20.0, (640, 480))

        while cap.isOpened():
            # capture frames from video
            ret, frame = cap.read()
            if not ret:
                break

            # Find haar cascade to draw bounding box around face
            # facecasc = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # faces = facecasc.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)

            # detect faces for smile detection
            rects = detector(gray, 0)

            # for (x, y, w, h) in faces:
            #     cv2.rectangle(frame, (x, y-50), (x+w, y+h+10), (255, 0, 0), 2)
            #     roi_gray = gray[y: y+h, x: x+w]
            #     roi_color = frame[y: y+h, x: x+w]
            #     cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0)
            #     prediction = model.predict(cropped_img)
            #     maxindex = int(np.argmax(prediction))
            #     cv2.putText(frame, emotion_dict[maxindex], (x+20, y-60),
            #                 cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

            for rect in rects:
                shape = predictor(gray, rect)
                face = face_utils.shape_to_np(shape)
                mouth = face[mStart:mEnd]
                vert, hori = smile_mar(mouth)
                print(vert, hori)
                mouthHull = cv2.convexHull(mouth)
                facehull = cv2.convexHull(face)
                cv2.drawContours(frame, [mouthHull], -1, (0, 255, 0), 3)
                cv2.drawContours(frame, [facehull], -1, (0, 0, 255), 3)

                # incrementing score for "happy" mood detection and smiling/laughing
                # if emotion_dict[maxindex] == 'Happy':
                #     if mar <= 0.3:
                #         points += 2
                #     elif mar > 0.35:
                #         points += 5

                if vert > stored_vert + 5 and hori > stored_hori + 5:
                    points += 5
                elif hori > stored_hori + 5:
                    points += 2

                cv2.putText(frame, "Score: {}".format(points), (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 3)

            output_video.write(frame)

        cap.release()
        output_video.release()
        cv2.destroyAllWindows()

        return points

    else:
      
        # image = cv2.imread('C:\\Users\\zeezl\\Desktop\\project Image\\Mood_Detection_CVC\\api\\uploaded\\'+video_path)
        image = cv2.imread('C:\\Users\\zeezl\\Desktop\\project Image\\Mood_Detection_CVC\\api\\video_processing\\'+video_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        rects = detector(gray, 0)
        shape = predictor(gray, rects[0])
        face = face_utils.shape_to_np(shape)
        mouth = face[mStart:mEnd]

        vert, hori = smile_mar(mouth)

        mouthHull = cv2.convexHull(mouth)
        facehull = cv2.convexHull(face)
        cv2.drawContours(image, [mouthHull], -1, (0, 255, 0), 3)
        cv2.drawContours(image, [facehull], -1, (0, 0, 255), 3)

        return (vert,hori)
