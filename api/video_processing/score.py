# from smile import calc_video_score
# import os
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# score = calc_video_score('test.avi', 10, 50)
# print("final score: ", score)
# vert, hori = calc_video_score('../uploaded/zeez.jpg' , video =False) 
# print(vert, hori)


import numpy as np
import cv2

cap = cv2.VideoCapture('marwan.mp4')

# Define the codec and create VideoWriter object
# fourcc = cv2.VideoWriter_fourcc(*'XVID')
# out = cv2.VideoWriter('test.avi', fourcc, 20.0, (640, 480))

while(cap.isOpened()):
    ret, frame = cap.read()
    if ret == True:
        # out.write(frame)

        cv2.imshow('frame', frame)
        cv2.waitKey(1)
    #     if cv2.waitKey(1) & 0xFF == ord('q'):
    #         break
    # else:
    #     print("can't read video")
    #     break

# Release everything if job is finished
cap.release()
# out.release()
cv2.destroyAllWindows()
