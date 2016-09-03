# fs-advanced

Light weight wrapper for fs module with functionality of moving, copying, deleting directory recursively synchronously and asynchronously. 

<br>

# Installation

	$ npm install fs-advanced
<br>
# How it works

fs-advanced exposes over 13 file/directoies related functions.

* mkdir - 
	> To make directory asynchronoulsy.

* copyFile - 
    > To copy asynchronously file executes callback function when copy is finished.

* rm -
	> To remove file asynchronously.

* rmSync -
	> To remove file Synchronously.

* rmdir - 
	> To remove directory asynchronously.

* rmdirSync - 
	> To remove folder Synchronously.

* copydirR -
	> copy directory recursively to folder and takes the callback Function.

* movedirR - 
    > To move folder recursively asynchronously.

* rmdirR - 
	> To remove files and folders recursively and executes callback.

* rmdirSyncR -
	> To remove files and folders recursively Synchronously.


<br>
###### The following 3 functions are the main reason for developing the package - 

* rmfilesR -
	> To remove only files from folders recursively and call callback function.

* rmfilesSyncR - 
	> To remove only files from folders recursively Synchronously.

* mkdirStructure - 
	> Making Directory-Structure specified by json.
	
          {
              "name" : "NAME_OF_DIRECTORY",
              "dir" : [
                        {
                	        "name" : "NAME_0F_CHILD_DIRECTORY_1"
                        },
                        {
                    	    "name" : "NAME_0F_CHILD_DIRECTORY_2"
                        }
              ]
          }

  > above json will make following directories.


                NAME_OF_DIRECTORY
                NAME_OF_DIRECTORY/NAME_0F_CHILD_DIRECTORY_1
                NAME_OF_DIRECTORY/NAME_0F_CHILD_DIRECTORY_1



<br>
# Development

Want to contribute? Great!

Please leave pull request at github project here [fs-advanced](https://github.com/KlwntSingh/fs-advanced)

<br>
# License

MIT
